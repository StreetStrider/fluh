
import Bud from 'lib/Bud'
import End from 'lib/End'

import { when_data } from 'map/when'

import reduce from 'map/reduce'


describe('reduce', () =>
{
	function sum (a, b)
	{
		return (a + b)
	}

	it('sum', () =>
	{
		var a = Bud()
		var b = a.map(reduce(100, sum))

		var rsb = []
		b.on(v => rsb.push(v))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(4)

		expect(b.value).eq(110)
		expect(rsb).deep.eq([ 101, 103, 106, 110 ])
	})

	it('sum ends', () =>
	{
		var a = Bud()
		var b = a.map(when_data(reduce(100, sum)))

		var rsb = []
		b.on(v => rsb.push(v))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(4)
		.emit(End)

		expect(b.value).eq(End)
		expect(rsb).deep.eq([ 101, 103, 106, 110, End ])
	})

	it('concat', () =>
	{
		function concat ()
		{
			return reduce([], (memo, next) =>
			{
				return [ ...memo, next ]
			})
		}

		var a = Bud()
		var b = a.map(when_data(concat()))

		var rsb = []
		b.on(v => rsb.push(v))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(4)
		.emit(End)

		expect(b.value).eq(End)
		expect(rsb).deep.eq(
		[
			[ 1 ],
			[ 1, 2 ],
			[ 1, 2, 3 ],
			[ 1, 2, 3, 4 ],
			End,
		])
	})
})
