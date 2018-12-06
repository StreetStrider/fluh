
import Bud from 'lib/Bud'

import filter from 'map/filter'


describe('filter', () =>
{
	it('filters', () =>
	{
		var rsb = []
		var rsc = []

		var a = Bud()
		var b = a.map(filter(x => ((x < 3) || (x > 4))))
		var c = b.map(filter(x => x % 2))

		b.on(v => rsb.push(v))
		c.on(v => rsc.push(v))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(4)
		.emit(5)

		expect(rsb).deep.eq([ 1, 2, 5 ])
		expect(rsc).deep.eq([ 1, 5 ])
	})
})
