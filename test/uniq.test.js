
import Bud from 'lib/Bud'
import End from 'lib/End'

import concat from 'lib/concat'

import uniq from 'map/uniq'


describe('uniq', () =>
{
	it('uniq', async () =>
	{
		var a = Bud()
		var b = a.map(uniq())

		var rs = concat(b)

		a
		.emit(1)
		.emit(1)
		.emit(2)
		.emit(2)
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		expect(await rs).deep.eq([ 1, 2, 1, 2, 3, End ])
	})

	it('uniq (value)', async () =>
	{
		var a = Bud(1)
		var b = a.map(uniq())

		var rs = concat(b)

		a
		.emit(1)
		.emit(1)
		.emit(2)
		.emit(2)
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		expect(await rs).deep.eq([ 1, 2, 1, 2, 3, End ])
	})

	it('uniq (value + emit)', async () =>
	{
		var a = Bud(0).emit(1)
		var b = a.map(uniq())

		var rs = concat(b)

		a
		.emit(1)
		.emit(1)
		.emit(2)
		.emit(2)
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		expect(await rs).deep.eq([ 1, 2, 1, 2, 3, End ])
	})
})
