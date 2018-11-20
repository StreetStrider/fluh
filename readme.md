
# api
## Bud

* Bud is a push-strategy FRP unit for creating data (event) streams.
* Bud can contain single value, similar to Behavior, but cannot change continuously, like real one.
This is a simplification for practical needs.
See the [explanation concerning Behaviors and Streams](https://github.com/funkia/hareactive/tree/b7875b05d6f61089f1411bca882713a346ce41b0#conceptual-overview).
* Initialized with `Nothing`.
* Can be pure and impure, depending on usage.

```js
/* empty Bud (Nothing) */
Bud()

/* emit new value */
Bud.emit(value)
```

## derivatives

* Create derived streams by using `join(...buds, (...bud_values) => new_value)`.
* `emit` propagated through the dependents.
* By using `join` we guarantee that every dependency changes at most once time
for single `emit`.
* `join(bud, fn)` is a `map`.
* You can skip values, returning `Nothing`, works like `filter`. Further dependencies will
not be touched.

```js
var a = Bud()

/* derive from `a` */
var b = join(a, (a) => a + 'b')

/* derive from both `a` and `b` */
var c = join(a, b, (a, b) => a + b + 'c')

/* skip (filter out) values */
var n = join(a, (a) => Nothing)
```

## effects

* Attach effects to Buds by using `bud.on(fn)`.
* Effects are fired in straight order.
* Effects run before propagating event to dependents and before effects of dependents.
* In effect you can re-`emit` values on another bud, but watch out for order of events and infinite loops.

```js
var a = Bud()

/* subscribe on changes */
a.on(() => { /* … */ })
```
