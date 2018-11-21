
import Bud from 'lib/Bud'
import Nothing from 'lib/Nothing'

describe('map', () =>
{
	it('like map', () =>
	{
		var rs1 = []
		var rs2 = []

		var a = Bud()
		var b = a.map(x => x * 2)
		var c = b.map(x => x + 1)

		b.on(v => rs1.push(v))
		c.on(v => rs2.push(v))

		a.emit(1).emit(2).emit(3)

		expect(rs1).deep.eq([ 2, 4, 6 ])
		expect(rs2).deep.eq([ 3, 5, 7 ])
	})

	it('like filter', () =>
	{
		var rs1 = []
		var rs2 = []

		var a = Bud()
		var b = a.map(filter(x => (x <= 3)))
		var c = b.map(x => x + 1)

		b.on(v => rs1.push(v))
		c.on(v => rs2.push(v))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(4)
		.emit(5)

		expect(rs1).deep.eq([ 1, 2, 3 ])
		expect(rs2).deep.eq([ 2, 3, 4 ])

		function filter (fn)
		{
			return (value) =>
			{
				if (fn(value))
				{
					return value
				}
				else
				{
					return Nothing
				}
			}
		}
	})
})
