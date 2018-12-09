
import Bud from 'lib/Bud'
import delay from 'thru/delay'

import End from 'lib/End'


describe('delay', () =>
{
	it('works', async () =>
	{
		var a = Bud()
		var b = a.thru(delay(10))

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		await new Promise(rs =>
		{
			b.on(value =>
			{
				if (value === End)
				{
					rs()
				}
			})
		})

		expect(rs).deep.eq([ 1, 2, 3, End ])
	})

	it('works with default', async () =>
	{
		var a = Bud()
		var b = a.thru(delay())

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		await new Promise(rs =>
		{
			b.on(value =>
			{
				if (value === End)
				{
					rs()
				}
			})
		})

		expect(rs).deep.eq([ 1, 2, 3, End ])
	})
})
