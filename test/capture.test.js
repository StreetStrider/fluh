
import Bud from 'fluh/lib/Bud'

import End from 'fluh/lib/End'
import concat from 'fluh/lib/concat'
import asap from 'fluh/lib/asap'

import capture from 'fluh/lib/capture'


describe('capture', () =>
{
	it('capture', async () =>
	{
		var a = Bud()
		var e = new Error('x')

		var b = a.map(capture(x =>
		{
			if (x === 3) { throw e }

			return x
		}))

		asap(() =>
		{
			a
			.emit(1)
			.emit(2)
			.emit(3)
			.emit(4)
			.emit(End)
		})

		expect(await concat(b)).deep.eq(
		[
			1,
			2,
			e,
			4,
			End,
		])
	})
})
