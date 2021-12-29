
import { End } from '../lib/End'

export type Predicate <Args extends any[]> = (...args: Args) => boolean

export function base_when <Args extends any[], True, False>
(
	pred: Predicate<Args>,
	fn_true:  (...args: Args) => True,
	fn_false: (...args: Args) => False,
)
:
	True & False

export type NoData = (Error | End)

export function when_data <T, R> (fn_true: (value: Exclude<T, NoData>) => R)
:
	(value: T) => (Extract<T, NoData> | R)

export function when_end <T, R> (fn_true: (value: End) => R)
:
	(value: T) => (Extract<T, End> | R)

export function when_error <T, R> (fn_true: (value: Error) => R)
:
	(value: T) => (Extract<T, Error> | R)
