
import { Nothing } from '../lib/Nothing'

export type PredicateType <Item, Kind extends Item> = (x: Item) => x is Kind
export type Predicate <Item> = (x: Item) => boolean

export default function <T, R extends T> (pred: PredicateType<T, R>): (value: T) => (R | Nothing)
export default function <T> (pred: Predicate<T>): (value: T) => (T | Nothing)
