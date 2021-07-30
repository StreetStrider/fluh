* **Breaking change**: `filter_by` is moved to its own module `map/filter-by`.
* Added `merge`.
* Added `debug`.
* `transfer` is now in index.
* Added `delta`.
* Added `promise`: `every`, `last` and `buffered` strategies.
* Added `raf`.
* `resource` is now in index.

## `0.5.0` — 2020-05-13
* **Breaking change**: `on` now returns disposer, not the bud itself.
* Added `uniq`.

## `0.4.0` — 2020-02-08
* Added `sample`.
* Added `filter_by`.
* Added `turnoff`.
* Added `resource`.

## `0.3.0` — 2019-12-26
* **Breaking change**: `when_data_all` now handles errors like `Promise.all`.
* Fixed not being possible to pass `undefined` as value to Bud, while readme allows that.
* Better cleanup on `End` to allow gc at early stages.
* Added `when_error`.
* Added `tap`.

## `0.2.0` — 2019-11-30
* **Breaking change**: now all effects run after all propagations, which means effects see all tip values in consistent state. Previously, effects run before propagating data further.

## `0.1.0` — 2019-11-25
* Initial release, added basic features: `Bud`, `join`, special values `Nothing`, `Many`, `End`.
* Atomicity.
* `map`, `filter` and `when`.
* `thru` and two high-order primitives: `defer` and `delay`.
* Cache `order` for static graph.
* Utilities: `Noop`, `Same`, `Fin`, `concat`, `drain`, `capture`.
