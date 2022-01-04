
type Reducer <T, R> = (memo: R, next: T) => R

export default function <T, R> (memo: R, reducer: Reducer<T, R>): (next: T) => R
