## `0.2.0` — 2019-11-30
* **Breaking change**: now all effects run after all propagations, which means effects see all tip values in consistent state. Previously, effects run before propagating data further.

## `0.1.0` — 2019-11-25
* Initial release, added basic features: `Bud`, `join`, special values `Nothing`, `Many`, `End`.
* Atomicity.
* `map`, `filter` and `when`.
* `thru` and two high-order primitives: `defer` and `delay`.
* Cache `order` for static graph.
* Utilities: `Noop`, `Same`, `Fin`, `concat`, `drain`, `capture`.
