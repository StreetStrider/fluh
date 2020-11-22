
import Bud from 'lib/Bud'

import Nothing from 'lib/Nothing'
import End from 'lib/End'

import delta from 'thru/delta'


describe('delta', () =>
{
	it('as prev', () =>
	{
		var a = Bud()
		var b = a.thru(delta())

		expect(b.value).eq(Nothing)

		a.emit(1)
		expect(b.value).eq(Nothing)

		a.emit(2)
		expect(b.value).eq(1)

		a.emit(3)
		expect(b.value).eq(2)

		a.emit(End)
		expect(b.value).eq(3)

		a.emit(End)
		expect(b.value).eq(3)
	})

	it('with delta function', () =>
	{
		var a = Bud(0)
		var b = a.thru(delta(Math.max))

		a.emit(-1)
		expect(b.value).eq(0)

		a.emit(1)
		expect(b.value).eq(1)

		a.emit(0)
		expect(b.value).eq(1)

		a.emit(5)
		expect(b.value).eq(5)

		a.emit(3)
		expect(b.value).eq(5)

		a.emit(-3)
		expect(b.value).eq(3)
	})
})
