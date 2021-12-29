
import { InspectOptions } from 'util'

import { Nothing } from './Nothing'
import { Many } from './Many'
import { End } from './End'

export type Disposer = () => void

export type OptionsDebug = InspectOptions &
{
	label: string,
}

export type Product <T> = (T | Many<T> | Nothing)
export type Producer <T, R = T> = (value: T) => Product<R>

export type Bud <T, T_Init = T> =
{
	id: string,
	value: T_Init,
	sample (): T_Init,

	constructor: typeof Bud,

	emit (value: Product<T>): Bud<T>,
	on (fn: (value: T) => void): Disposer,
	map <R> (fn: Producer<T, R>): Bud<R>,
	thru <R> (fn: (bud: Bud<T>) => Bud<R>): Bud<R>,

	debug (label: string, options?: InspectOptions): Disposer,
	debug (options?: OptionsDebug): Disposer,
}

declare const Bud:
{
	<T>(): Bud<T, (T | Nothing)>,
	<T>(value: T): Bud<T>,
	is (it: any): it is Bud<any>,
}

export default Bud
