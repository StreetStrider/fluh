
import Bud from 'fluh/lib/Bud'
import End from 'fluh/lib/End'

import filter from 'fluh/map/filter'
import filter_by from 'fluh/map/filter-by'

import { when_data } from 'fluh/map/when'

function isNumber (x: any): x is number
{
	return (typeof x === 'number')
}

function isString (x: any): x is string
{
	return (typeof x === 'string')
}

function Filter ()
{
	const input = Bud<number | string>()
	const nums = input.map(filter(isNumber))
	const strs = input.map(filter(isString))
	const othr = input.map(filter(x => Boolean(String(x).match(/^\d+$/))))

	nums // $ExpectType Bud<number, number>
	strs // $ExpectType Bud<string, string>
	othr // $ExpectType Bud<string | number, string | number>

	nums.on(x => console.log(x + 1))
	strs.on(x => x.toUpperCase())
	othr.on(x => console.log(x))

	input
	.emit(1)
	.emit('b')
	.emit(2)
	.emit('c')
	.emit(3)
}

function FilterBy ()
{
	const input = Bud<number>()
	const signal = input.map(v => (v > 2))
	const output = input.map(filter_by(signal))

	signal // $ExpectType Bud<boolean, boolean>
	output // $ExpectType Bud<number, number>

	output.on(x => console.log(x + 1))

	input.emit(1).emit(2).emit(3)
}

function WhenData ()
{
	const input = Bud<number | typeof End>()

	input.map(x => x * 2) // $ExpectError
	const output = input.map(when_data(x => x * 2))

	output // $ExpectType Bud<number | typeof End, number | typeof End>

	output.on(x => console.log(x + 1)) // $ExpectError
	output.on(when_data(x => console.log(x + 1)))

	input.emit(1).emit(2).emit(3).emit(End)
}

function WhenDataRedundant ()
{
	const input = Bud<number>()
	const output = input.map(when_data(x => x * 2))

	output // $ExpectType Bud<number, number>

	output.on(x => console.log(x + 1))
	output.on(when_data(x => console.log(x + 1)))

	input.emit(1).emit(2).emit(3)
}

function WhenDataError ()
{
	const input = Bud<number | Error | typeof End>()

	input.map(x => x * 2) // $ExpectError
	const output = input.map(when_data(x => x * 2))

	output // $ExpectType Bud<number | Error | typeof End, number | Error | typeof End>

	output.on(x => console.log(x + 1)) // $ExpectError
	output.on(when_data(x => console.log(x + 1)))

	input.emit(1).emit(2).emit(3).emit(new Error).emit(End)
}
