# the idea

When thinking of reactive stuff there's a whole space of decisions you need to make.

* Is it push or pull?
* Is it always live or depends on subscribers' presense?
* Does stream have value at any time?
* Is it sync or async?
* How errors should be handled?
* Does stream end?
* Is data graph static or dynamic?

Choosing some designs will lead to specific FRP system.
Watch [this speech](https://www.youtube.com/watch?v=Agu6jipKfYw) about this decision space.

**fluh** is inspired mainly by [flyd](https://github.com/paldepind/flyd). I want to use the reactivity for
request-response systems, command-line applications and (especially) UIs. For that scope push strategy is good.

The main unit is called `Bud`.
* Bud is a push-strategy FRP unit for creating data (event) streams.
* Bud is always active — it just emits values and push them to dependents, no [backpressure](https://nodejs.org/en/docs/guides/backpressuring-in-streams/),
no [cold streams](https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339)
or pulling-on-demand.
* Bud is a Stream, but contain single (current) value, similar to Behavior. It's not an actual Behavior,
because it cannot change continuously, like real one.
This design is a simplification for my practical needs described above.
See the [explanation concerning Behaviors and Streams](https://github.com/funkia/hareactive/tree/e40dddd1b6d55e59a9d9bf319b7d426566cbfd8d#conceptual-overview).
Stream is a push, Behavior is a pull, there's a distinction.
* Bud is initialized with `Nothing` value, means no value. It is explicit value,
so you are free to emit `null` or `undefined` if you really want to.
* When Bud acquire value it propagates it to *effects* and *dependents*. If Bud already has value, newly created effects
and dependents will be notified immediately with that value.
* All schema is sync by default, but you are free to create async operators (defer, delay…).
* Data graph is optimized for static usage, however, you can create new streams dynamically. Streams' disposal is still a task to solve (`TODO`). In static graph disposal is not an issue at all.
* Can be pure and impure, depending on usage.

If you think some of the decisions are not good, there's a great family of
different opinions. Check out at least theese great ones:
[most.js](https://github.com/cujojs/most),
[hareactive](https://github.com/funkia/hareactive),
[flyd](https://github.com/paldepind/flyd),
[xstream](https://github.com/staltz/xstream),
[graflow](https://github.com/pmros/graflow),
[RX](https://github.com/ReactiveX/rxjs),
[pull-stream](https://github.com/pull-stream/pull-stream),
[Highland](https://github.com/caolan/highland).
[MobX](https://mobx.js.org/).

# api
## Bud

Bud is a main FRP unit.

```js
/* empty Bud (Nothing) */
Bud()

/* Bud with value */
Bud('value')

/* emit new values */
Bud.emit('value 1').emit('value 2')
```

## derivatives

* Create derived streams by using `var new_bud = join(...buds, (...bud_values) => new_value)`.
* `emit`'s are propagated through the dependents.
* By using `join` we guarantee that every dependency changes at most once for single `emit`. See [atomic updates](#atomic-updates).
* `join(bud, fn)` is a `map`.
* You can skip values, returning `Nothing`, works like `filter`. Further dependencies will
not be touched.
* You can pass more than one value using `Many(...values)`. Additional values will be handled one after another atomically (for the whole dependent subtree) and synchronously.
* It is better to not performing side-effects inside `join`'s transformer. It is possible but
it's better to do it as an effect (`on`).
* `bud.map(fn)` is a shortcut for `join` deriving from a single Bud.

```js
var a = Bud()

/* derive from `a` (map) */
var b = join(a, (a) => a + 'b')

/* derive from both `a` and `b` */
var c = join(a, b, (a, b) => a + b + 'c')

/* skip (filter out, reject) values */
var n = join(a, (a) => Nothing)

/* return two values for each input (like transducer) */
var n = join(a, (a) => Many(a, a + 'x'))

/* derive from single Bud `a` */
var b = a.map((a) => a + 'b')
```

## high-order

* Use `thru` for functions which accept Bud and return new Bud.
* high-order `thru` transformers good when you can't express transformation in terms of `map`.

```js
var a = Bud()

/* delay must return function from Bud to Bud */
var b = a.thru(delay(50))
```

## effects

* Attach effects to Bud by using `bud.on(fn)`.
* Effects are fired in straight-by-attach order.
* Effects run before propagating event to dependents and before effects of dependents.
* In effect you can re-`emit` values on another Bud (or even that one), but watch out for order of events and infinite loops.
* Re-emitting will happen after current emit is done for the whole dependent subtree.

```js
var a = Bud()

/* subscribe to changes */
a.on((value) => console.log('a:', value))
```

# interesting reading
## atomic updates
fluh just like flyd solves atomic updates problem. This means that in case of graph `A → B, A → C, B & C → D` stream `D` indirectly depends twice on `A`, via `B` and `C`. fluh guarantees that in case of emit on `A` dependent `D` would recieve update only once, with two updated values from `B` and `C`.

To do this, fluh recursively collects all dependencies of any `A` and orders them topologically. That `order` is lazily cached and in use until graph changes. This gives excellent results for static graphs and optimal reordering when graph changes rarely.

`order` is used as a basis for cycle, so all dependencies will be updated in single pass, without using recursion.

See also [flyd's atomic updates](https://github.com/paldepind/flyd/tree/180e8f5b859ac9ae388a193d334e94f03e02feef#atomic-updates).

## `map` with Nothing and Many
fluh's `bud.map(fn)` is basically a [functor protocol](https://github.com/fantasyland/fantasy-land#functor), however, with additional features. The thing with usual `map` is that it always returns single value, mapping functor from one value to another. If you need to skip values or add another values you need to use something like `filter` and `flatMap`. In some cases this is not enough and you need to adress more complex tasks with the help of `reduce` or [transducers](https://github.com/cognitect-labs/transducers-js).

fluh's `map` works in three ways:
1. Ordinary map (return any values).
2. Skip values. Return special symbol `Nothing` and current value will be skipped. This means no updates on dependencies, value would be just eliminated from flow.
3. Return multiple values with `Many(...values)`. `Many`, just like `Nothing` is a special type, so no collisions with arrays or other objects. If instance of `Many` is returned from `map` it will propagate further first value from it and, after graph is updated atomically, emit following values as additional usual emits.

So `map` covers all cases for `map`, `filter` and `flatMap` in a common manner.

## high-order transformations
In practice `map` covers most of the cases, but there're may advanced tasks when you need to take a Bud, transform it (for instance, involving state) and return modified Bud: `b = transform(a)`.

In order to do this, fluh has `bud.thru(fn)` which accepts function from one Bud to another and returns result of invocation that function on this particular Bud.

Here's the example of how it can be used to make Bud async by default (by creating new dependent Bud which receives updates asynchronously):

```js
function defer (bud)
{
	var deferred = bud.constructor()

	bud.on(value =>
	{
		setTimeout(() =>
		{
			deferred.emit(value)
		}
		, 0)
	})

	return deferred
}
```

Then use it via `thru`:
```js
var a = Bud(1)
var b = a.thru(defer)
a.emit(2)
```

# license
ISC, © Strider, 2019.
