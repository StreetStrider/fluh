
import Bud from 'fluh/lib/Bud'
import Nothing from 'fluh/lib/Nothing'
import Many from 'fluh/lib/Many'


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

	it('produce Many', () =>
	{
		var rs1 = []
		var rs2 = []

		var a = Bud()
		var b = a.map(a => Many(a + 'b1', a + 'b2'))
		var c = b.map(b => Many(b + 'c1', b + 'c2'))

		b.on(v => rs1.push(v))
		c.on(v => rs2.push(v))

		a
		.emit(1)
		.emit(2)
		.emit(3)

		expect(rs1).deep.eq([ '1b1', '1b2', '2b1', '2b2', '3b1', '3b2' ])
		expect(rs2).deep.eq(
		[
			'1b1c1', '1b2c1', '1b1c2', '1b2c2',
			'2b1c1', '2b2c1', '2b1c2', '2b2c2',
			'3b1c1', '3b2c1', '3b1c2', '3b2c2',
		])
	})
})
