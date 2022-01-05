import Bud from 'fluh/lib/Bud'
import End from 'fluh/lib/End'

import reduce from 'fluh/map/reduce'

import { when_data } from 'fluh/map/when'

function sum (a: number, b: number)
{
	return (a + b)
}

function concat <T> ()
{
	return reduce<T, T[]>([] as T[], (memo: T[], next: T) =>
	{
		return [ ...memo, next ]
	})
}

function Sum ()
{
	const a = Bud<number>()
	const b = a.map(reduce(100, sum))

	b // $ExpectType Bud<number, number>

	const rsb = []
	b.on(v => rsb.push(v))

	a
	.emit(1)
	.emit(2)
	.emit(4)
}

function SumRedundant ()
{
	const a = Bud<number>()
	const b = a.map(when_data(reduce(100, sum)))

	b // $ExpectType Bud<number, number>

	const rsb = []
	b.on(v => rsb.push(v))

	a
	.emit(1)
	.emit(2)
	.emit(3)
}

function SumEnd ()
{
	const a = Bud<number | typeof End>()
	const b = a.map(when_data(reduce(100, sum)))

	b // $ExpectType Bud<number | typeof End, number | typeof End>

	const rsb = []
	b.on(v => rsb.push(v))

	a
	.emit(1)
	.emit(2)
	.emit(3)
	.emit(End)
}

function Concat ()
{
	const a = Bud<number | typeof End>()
	const b = a.map<number[] | typeof End>(when_data(concat<number>()))
	// const b = a.map<number[] | typeof End>(when_data(concat()))
	// const b = a.map(when_data(concat<number>()))

	b // $ExpectType Bud<typeof End | number[], typeof End | number[]>

	const rsb = []
	b.on(v => rsb.push(v))

	a
	.emit(1)
	.emit(2)
	.emit(3)
	.emit(4)
	.emit(End)
}
