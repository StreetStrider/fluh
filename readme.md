# the idea

When thinking of reactive stuff there's a whole space of decisions you need to make.

* Is it push or pull?
* Is it always live or depends on subscribers' presense?
* Does stream have value at any time?
* Is it sync or async?
* How errors should be handled?
* Does stream end?

Choosing some designs will lead to specific FRP system.
Watch [this speech](https://www.youtube.com/watch?v=Agu6jipKfYw) about this decision space.

**fluh** is inspired mainly by [flyd](https://github.com/paldepind/flyd). I want to use reactivity for
request-response systems, command-line applications and UIs. For that scope push-strategy is good.

The main unit is called `Bud`.
* Bud is a push-strategy FRP unit for creating data (event) streams.
* Bud is always active — it just emits values and push them to dependents, no [backpressure](https://nodejs.org/en/docs/guides/backpressuring-in-streams/),
no [cold streams](https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339)
or pulling-on-demand.
* Bud is a Stream, but contain single (current) value, similar to Behavior. It's not an actual Behavior,
because it cannot change continuously, like real one.
This design is a simplification for my practical needs described above.
See the [explanation concerning Behaviors and Streams](https://github.com/funkia/hareactive/tree/b7875b05d6f61089f1411bca882713a346ce41b0#conceptual-overview).
Stream is a push, Behavior is a pull, there's a distinction.
* Bud is initialized with `Nothing` value, means no value. It is explicit value,
so you are free to emit `null` or `undefined` if you really want to.
* When Bud acquire value it propagates it to *effects* and *dependents*. If Bud already has value, newly created effects
and dependents will be notified immediately with that value.
* All schema is sync by default, but you are free to create async operators (defer, delay…).
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

# api
## Bud

Bud is a main FRP unit.

```js
/* empty Bud (Nothing) */
Bud()

/* emit new value */
Bud.emit(value)
```

## derivatives

* Create derived streams by using `var new_bud = join(...buds, (...bud_values) => new_value)`.
* `emit`'s are propagated through the dependents.
* By using `join` we guarantee that every dependency changes at most once time
for single `emit`. See [diamond problem](https://github.com/paldepind/flyd#atomic-updates).
* `join(bud, fn)` is a `map`.
* You can skip values, returning `Nothing`, works like `filter`. Further dependencies will
not be touched.
* It is better to not performing side-effects inside `join`'s transformer. It is possible but
it's better to do it as an effect.

```js
var a = Bud()

/* derive from `a` (map) */
var b = join(a, (a) => a + 'b')

/* derive from both `a` and `b` */
var c = join(a, b, (a, b) => a + b + 'c')

/* skip (filter out, reject) values */
var n = join(a, (a) => Nothing)
```

## effects

* Attach effects to Bud by using `bud.on(fn)`.
* Effects are fired in straight by attach order.
* Effects run before propagating event to dependents and before effects of dependents.
* In effect you can re-`emit` values on another Bud (or even that), but watch out for order of events and infinite loops.
* Re-emitting will happen after current emit is done for the whole dependent subtree.

```js
var a = Bud()

/* subscribe on changes */
a.on(() => { /* … */ })
```

# license
ISC, © Strider, 2018.
