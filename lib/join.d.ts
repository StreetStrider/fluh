/* eslint-disable max-len */
/* eslint-disable max-params */

import { Bud } from './Bud'
import { Product } from './Bud'

export type Producer <T extends any[], R> = (...values: T) => Product<R>

declare function join <T, R> (bud: Bud<T>, fn: Producer<[ T ], R>): Bud<R>
declare function join <T1, T2, R> (bud1: Bud<T1>, bud2: Bud<T2>, fn: Producer<[ T1, T2 ], R>): Bud<R>
declare function join <T1, T2, T3, R> (bud1: Bud<T1>, bud2: Bud<T2>, bud3: Bud<T3>, fn: Producer<[ T1, T2, T3 ], R>): Bud<R>
declare function join <T1, T2, T3, T4, R> (bud1: Bud<T1>, bud2: Bud<T2>, bud3: Bud<T3>, bud4: Bud<T4>, fn: Producer<[ T1, T2, T3, T4 ], R>): Bud<R>
declare function join <T1, T2, T3, T4, T5, R> (bud1: Bud<T1>, bud2: Bud<T2>, bud3: Bud<T3>, bud4: Bud<T4>, bud5: Bud<T5>, fn: Producer<[ T1, T2, T3, T4, T5 ], R>): Bud<R>
declare function join <T extends any[], R> (fn: Producer<T, R>, ...buds: { [ Key in keyof T ]: Bud<T[Key]> }): Bud<R>

export default join
