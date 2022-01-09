
import { Bud } from './Bud'
import { Product } from './Bud'

type Union <T extends any[]> = T[number]

export type Producer <T extends any[], R> = (...values: T) => Product<R>

export default function <T extends any[]> (...buds: { [ Key in keyof T ]: Bud<T[Key]> }): Bud<Union<T>>
