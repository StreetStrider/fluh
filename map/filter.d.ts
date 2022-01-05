
import { Producer } from '../lib/Bud'

export type PredicateType <Item, Kind extends Item> = (x: Item) => x is Kind
export type Predicate <Item> = (x: Item) => boolean

export default function <T, R extends T> (pred: PredicateType<T, R>): Producer<T, R>
export default function <T> (pred: Predicate<T>): Producer<T, T>
