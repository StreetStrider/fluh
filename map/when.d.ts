
import { End } from '../lib/End'

export type Predicate <Args extends any[]> = (...args: Args) => boolean

export function base_when <Args extends any[], True, False>
(
	pred: Predicate<Args>,
	fn_true:  (...args: Args) => True,
	fn_false: (...args: Args) => False,
)
:
	(...args: Args) => (True & False)

export function When <Args extends any[], True, False>
(
	pred: Predicate<Args>,
	fn_false_default?: (...args: Args) => False,
):
	(
		fn_true:  (...args: Args) => True,
		fn_false: (...args: Args) => False,
	)
	=>
		(...args: Args) => (True & False)


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


type Union <T extends any[]> = T[number]

export function when_data_all <Inputs extends any[], R>
(
	fn_true: (value: { [ Key in keyof Inputs ]: Exclude<Inputs[Key], NoData> }) => R
)
:
	(...values: Inputs) => (Extract<Union<Inputs>, NoData> | R)
