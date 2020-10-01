
import Bud from 'lib/Bud'
import End from 'lib/End'

import { when_data } from 'map/when'

import filter from 'map/filter'
import filter_by from 'map/filter-by'


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

	it('no end', () =>
	{
		var rs1 = []
		var rs2 = []

		var a = Bud()

		var b1 = a.map(filter(x => typeof x === 'number' && x > 1))
		var b2 = a.map(when_data(filter(x => (x > 1))))

		b1.on(v => rs1.push(v))
		b2.on(v => rs2.push(v))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		expect(rs1).deep.eq([ 2, 3 ])
		expect(rs2).deep.eq([ 2, 3, End ])
	})

	it('filter_by', () =>
	{
		var a = Bud()
		var signal = a.map(v => (v > 2))
		var b = a.map(filter_by(signal))

		var rs = []
		b.on(v => rs.push(v))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(4)
		.emit(5)

		expect(rs).deep.eq([ 3, 4, 5 ])
	})
})
