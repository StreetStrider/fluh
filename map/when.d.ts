
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

export function when_data <Out, T extends Exclude<Out, NoData>, R> (fn_true: (value: T) => R)
:
	(value: Out) => (Extract<Out, NoData> | R)

export function when_end <T, R> (fn_true: (value: End) => R)
:
	(value: T) => (Exclude<T, End> | R)

export function when_error <T, R> (fn_true: (value: Error) => R)
:
	(value: T) => (Exclude<T, Error> | R)


type Union <T extends any[]> = T[number]

export function when_data_all
<
	Outs extends any[],
	Ins extends { [ Key in keyof Outs ]: Exclude<Outs[Key], NoData> },
	R
>
(fn_true: (...args: Ins) => R)
:
	(...values: Outs) => (Extract<Union<Outs>, NoData> | R)
