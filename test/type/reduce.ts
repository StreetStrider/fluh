import Bud from 'fluh/lib/Bud'
import End from 'fluh/lib/End'

import reduce from 'fluh/map/reduce'

import { when_data } from 'fluh/map/when'

function sum (a: number, b: number)
{
	return (a + b)
}

function Sum ()
{
	const a = Bud<number>()
	const b = a.map(reduce(100, sum))

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

	const rsb = []
	b.on(v => rsb.push(v))

	a
	.emit(1)
	.emit(2)
	.emit(3)
	.emit(End)
}