# fluh

[![npm|fluh](http://img.shields.io/badge/npm-fluh-CB3837.svg?style=flat-square)](https://www.npmjs.org/package/fluh)

> Functional reactive library with atomic push strategy

This library is designed to be easy to learn and simple to use. It may be meant as an answer to more complex systems which demand a lot from you even while solving simplest tasks.

fluh is sync-by-default event graph library with only push strategy. This particular design is easy to reason about. Most of the time it will work just as you expect it to work: reactive nodes pass values to dependents and fires effects after that. The order of firing is deterministic and straighforward.

The API is designed in a composable way, which means that it is really easy to create new transformations and utilities without tapping into the core. The API borrows heavily from functional paradigm, but without becoming it a burden. You still can use impure and stateful code, if you need. You can write code from left to right: there is chainable API and you don't need to use data-last functions if you don't want to.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [The idea](#the-idea)
- [API](#api)
  - [Bud](#bud)
  - [derivatives](#derivatives)
  - [merging](#merging)
  - [high-order](#high-order)
  - [effects](#effects)
  - [resources](#resources)
- [Interesting reading](#interesting-reading)
  - [atomic updates](#atomic-updates)
  - [`map` with Nothing and Many](#map-with-nothing-and-many)
  - [high-order transformations](#high-order-transformations)
  - [handling errors](#handling-errors)
  - [handling promises](#handling-promises)
- [examples](#examples)
- [License](#license)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The idea

When thinking of reactive stuff there're multiple spaces of decisions in which you have to make a choice.

* Is it push or pull?
* Is it unicast or multicast?
* Is it always live or does it depend on subscribers' presense?
* Does stream have value at any time?
* Is it sync or async?
* How errors should be handled?
* Does stream end?
* Is data graph static or dynamic?

Choosing some decisions will lead to a specific reactive system.
Watch [this speech](https://www.youtube.com/watch?v=Agu6jipKfYw) about this vast decision space.

**fluh** is inspired by [flyd](https://github.com/paldepind/flyd) in general. I want to use the reactivity for request-response systems, command-line applications and (especially) UIs. For that scope push strategy is good.

The main unit is called `Bud`.
* Bud is a push-strategy FRP unit for creating data (event) streams.
* Bud is always active — it just emits values and pushes them to the dependents, no [backpressure](https://nodejs.org/en/docs/guides/backpressuring-in-streams/), no [cold streams](https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339) or pulling-on-demand.
* Bud is a Stream, but contain single (current) value, similar to Behavior. It's not an actual Behavior, because it cannot alterate continuously, like real one.
This design is a simplification for my practical needs described above.
See the [explanation concerning Behaviors and Streams](https://github.com/funkia/hareactive/tree/e40dddd1b6d55e59a9d9bf319b7d426566cbfd8d#conceptual-overview).
Stream is a push, Behavior is a pull, there's a distinction.
* Bud is initialized with special `Nothing` value, means no value. It is an explicit value, so you are free to emit `null` or `undefined` in your streams if you need to.
* When Bud acquire value it propagates it to *effects* and *dependents*. If Bud already has value, newly created effects and dependents will be notified immediately with that value.
* Effects run when all dependents had been updated, so, from effects' perspective the graph's all current values change atomically and are always in a consistent state.
* Data graph is sync by default, but you are free to use async operators (defer, delay, raf) or create your own (like throttle, debounce, nextTick…).
* Data graph is multicast — multiple dependencies does not create copies of the source and are just subscribed to that single source. It also solves [diamond problem](#atomic-updates) for you.
* Data graph is optimized for static usage, however, you can create new streams dynamically. Streams' disposal triggered by emitting `End` on a stream. If `End` is received, the graph would be cleaned from terminated stream as well as certain streams' cross-references, which opens a way for a garbage collection. Streams that are both terminated and non-referenced by user become able to be garbage collected. In static graph memory consumption would remain on a stable level.
* Can be pure or impure, depending on the usage. You can create stateful elements to solve complex tasks, like running totals or rate limiting.

If you think some of that decisions are not good, there's a great family of different opinions. Check out at least theese great ones:
[most.js](https://github.com/cujojs/most),
[bacon.js](https://github.com/baconjs/bacon.js),
[flyd](https://github.com/paldepind/flyd),
[hareactive](https://github.com/funkia/hareactive),
[xstream](https://github.com/staltz/xstream),
[graflow](https://github.com/pmros/graflow),
[S.js](https://github.com/adamhaile/S),
[RX](https://github.com/ReactiveX/rxjs),
[pull-stream](https://github.com/pull-stream/pull-stream),
[Highland](https://github.com/caolan/highland),
[MobX](https://mobx.js.org/).

## API
### Bud

Bud is a main FRP unit.

```js
/* empty Bud (Nothing) */
const bud = Bud()

/* Bud with value */
const bud = Bud('value')

/* emit new values */
bud.emit('value 1').emit('value 2')
```

### derivatives

* Create derived streams by using `const new_bud = join(...buds, (...bud_values) => new_value)`.
* `emit`'s are propagated through the dependents.
* By using `join` we guarantee that every dependency changes at most once for single `emit`. See [atomic updates](#atomic-updates).
* `join(bud, fn)` is a `map`.
* You can skip values, returning `Nothing`, works like `filter`. Further dependencies will
not be touched.
* You can pass more than one value using `Many(...values)`. Additional values will be handled one after another atomically (for the whole dependent subtree) and synchronously.
* It is better to not performing side-effects inside `join`'s transformer. It is possible but
it's better to do it as an effect (`on`).
* All effects run after all propagations. From effects' perspective graph is always in a consistent state, corresponding to the most recently propagated value. Graph always changes atomically.
* `bud.map(fn)` is a shortcut for `join` deriving from a single Bud.

```js
const a = Bud()

/* derive from `a` (map) */
const b = join(a, (a) => a + 'b')

/* derive from both `a` and `b` */
const c = join(a, b, (a, b) => a + b + 'c')

/* skip (filter out, reject) values */
const n = join(a, (a) => Nothing)

/* return two values for each input (like transducer) */
const n = join(a, (a) => Many(a, a + 'x'))

/* derive from single Bud `a` */
const b = a.map((a) => a + 'b')
```

### merging

* As an alternative to `join` where you join several streams by function of corresponding arity it is possible to just merge values of several streams into a single stream.
* This is another way to create derivatives and it shares all the basic properties: sync, atomic, side effects run after all propagations.
* The difference is that you can't use a joiner function and you must take care of `End` by your own, since any `End` will end the merged stream.
* In case of multiple simultaneous inputs all of them would be passed down merged stream in the order of inputs from left to right. The resulting value would be the most right one.

```js
const a = Bud()
const b = Bud()

/* merge all from `a` and `b` */
const c = merge(a, b)

/* diamond is also possible */
const a = Bud()
const b = join(a, (a) => a + 'b')
const c = join(a, (a) => a + 'c')
const d = merge(b, c)
```

### high-order

* Use `thru` for functions which accept Bud and return new Bud.
* high-order `thru` transformers good when you can't express transformation in terms of `map`.

```js
const a = Bud()

/* delay must return function from Bud to Bud */
const b = a.thru(delay(50))
```

### effects

* Attach effects to Bud by using `bud.on(fn)`.
* Effects are fired in straight-by-attach order.
* Effects on certain Bud run after propagating event to all dependents and before effects on that dependents.
* In effect you can re-`emit` values on another Bud (or even that one), but taking care of order of emits and infinite loops are on your own.
* Re-emitting will happen only after current emit is done for the whole dependent subtree.
* `bud.on(fn)` returns disposer function.

```js
const a = Bud()

/* subscribe to changes */
const disposer = a.on((value) => console.log('a:', value))

/* disposing of the effect */
disposer()
```

### resources

* If you want to create a Bud binded to some disposable event source, use `resource`.
* Such Bud will dispose underlying resource when it receives `End`.
* Provide to `resource` a function which initiates resource and returns disposer function. Function itself will be provided with emit function (as a first argument) and a newly created Bud (as a second).

```js
/* create Bud from DOM Event */
function dom_event (element, eventname) {
	return resource((emit) => {
		element.addEventListener(eventname, emit)

		return function disposer () {
			if (! element) return

			element.removeEventListener(eventname, emit)

			/* allow gc to release Bud and target element earlier */
			element = null
			emit = null
		}
	})
}

/* create Bud from interval timer */
function interval (ms) {
	return resource((emit) => {
		let t = setInterval(emit, ms)

		return function disposer () {
			if (! t) return

			clearInterval(t)

			t = null
			emit = null
		}
	})
}
```

## Interesting reading
### atomic updates
fluh just like flyd solves atomic updates problem. This means that in case of graph `A → B, A → C, B & C → D` stream `D` indirectly depends twice on `A`, via `B` and `C`. fluh guarantees that in case of single emission on `A` dependent `D` would recieve update only once, with two updated values from `B` and `C`.

To do this, fluh recursively collects all dependencies of any `A` and orders them topologically. That `order` is lazily cached and is in use until graph changes. This gives excellent results for static graphs and optimal reordering when graph changes rarely.

`order` is used as a basis for cycle, so all dependencies will be updated in single pass, without using recursion.

See also [flyd's atomic updates](https://github.com/paldepind/flyd/tree/180e8f5b859ac9ae388a193d334e94f03e02feef#atomic-updates).

### `map` with Nothing and Many
fluh's `bud.map(fn)` is very similar to [functor protocol](https://github.com/fantasyland/fantasy-land#functor), however, with additional features. The thing with usual `map` is that it always returns single value, mapping functor from one value to another. If you need to skip values or add another values you need to use something like `filter` or `flatMap`. In some cases this is not enough and you need to address more complex tasks with the help of `reduce` or [transducers](https://github.com/cognitect-labs/transducers-js).

fluh's `map` works in three ways:
1. Ordinary map (return any values).
2. Skip values. Return special symbol `Nothing` and current value will be skipped. This means no updates on dependencies, value would be just eliminated from flow.
3. Return multiple values with `Many(...values)`. `Many`, just like `Nothing` is a special type, so no collisions with arrays or other objects. If instance of `Many` is returned from `map` it will propagate further first value from it and, after graph is updated atomically, emit following values as additional usual emits.

So `map` covers all cases for `map`, `filter` and `flatMap` in a common manner.

### high-order transformations
In practice, `map` covers most of the cases, but there're may be advanced tasks when you need to take a Bud, transform it (for instance, involving state) and return modified Bud: `const new_bud = transform(bud)`.

In order to do this, fluh has `bud.thru(transform)` which accepts function from one Bud to another and returns result of invocation that function on this particular Bud.

Here's the example of how it can be used to make Bud async by default (by creating new dependent Bud which receives updates asynchronously):

```js
function defer (bud) {
	const deferred = bud.constructor()

	bud.on((value) => {
		setTimeout(() => {
			deferred.emit(value)
		}
		, 0)
	})

	return deferred
}
```

Then use it via `thru`:
```js
const a = Bud(1)
const b = a.thru(defer)
a.emit(2)
```

fluh exposes special helper for easier implementation of high-order transformations, called `lib/trasfer`. In terms of `transfer` previous `defer` example may be implemented in such manner:
```js
function defer (bud) {
	return transfer(bud, (value, emit) => {
		setTimeout(() => emit(value), 0)
	})
}
```

### handling errors
fluh does not capture throws by default, but you can make any function to do that, by decorating it with `capture`:
```js
const a = Bud()

import { capture } from 'fluh'

const b = a.map(capture((x) => {
	/* throws in this function will be captured: */
	/* … throw e … */

	return x + 1
}))
```
From now, any throws will return raised error as normal returns instead.

Note that such function will return mixed data/error content. There's no special values aside from `Nothing`, `Many` and `End`. fluh treats `Error` objects as normal data, so you'll need additional steps to handle them.

```js
import { when_data } from './map/when'

/* `when_data` allows to work with data in pure manner, */
/* passing past any `Error` instances and `End` */
/* only real data passed to target function */
const c = b.map(when_data((b) => b + 1))
```

There's no special error channel, use mixed content in combine with helper above if you need to handle errors. If you want a more pure approach, bring your own `Either`/`Result` container.

### handling promises
fluh is sync by default. This decision makes whole graph predictable, allows to atomically update and opens a way for performance optimizations. Promise is just a regular value for fluh, so, in order to extract value from it, special high-order transformation is required. Such transformation will always resolve asynchronously, even if promise is already resolved.

fluh supports three strategies for resolving promises:
* `every` — every promise value passed to this transformation will instantly passthrough. In that case, no events lost and no additional memory is used, however, the order of resolved values may not be identical to the order of corresponding promises due to the race condition.
* `last` — only last recieved promise value is passed through, if previous promise was not resolved, its value would be ignored. In that case, the resolution order is preserved, no additional memory is used, however, some promise values may be lost.
* `buffered(N)` — store `N` recent promises and resolve them in order. If some promises was not resolved and they exceed `N` when new promises received, the older ones will be ignored. In that case, the resolution order is preserved, and up to `N` simultaneous racing promises are guaranteed to be passed through, however, if more simultaneous promises received, some of them still be lost.

fluh promise transformations treats promise rejections as data values. So, the transformations will emit mixed data/error content. You'll need `when_data` to handle them.

## examples
Learn by [examples](examples/). You can run `set-interval` example via `npm run example set-interval`.

## License
ISC, © Strider, 2021.
