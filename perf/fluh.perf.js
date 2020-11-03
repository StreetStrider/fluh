
import Bud  from '../lib/Bud'
import join from '../lib/join'
import Many from '../lib/Many'


export default
{
	diamond ()
	{
		var n = 1

		var A = Bud()
		var b = join(A, a => a + 1)
		var c = join(b, b => b + 1)
		var d = join(A, c, (a, c) => a + c + 1)

		d.on(() => n++)

		return () =>
		{
			A.emit(17)
		}
	},

	deep_linear ()
	{
		var n = 1

		var a = Bud()

		var b = a
		for (let n = 0; n < 100; n++)
		{
			b = join(b, b => b + 1)
		}

		b.on(() => n++)

		return () =>
		{
			a.emit(17)
		}
	},

	deep_linear_many ()
	{
		var n = 1

		var a = Bud()

		var b = a
		for (let n = 0; n < 100; n++)
		{
			b = join(b, b => b + 1)
		}

		b.on(() => n++)

		return () =>
		{
			a.emit(Many(17, 1917))
		}
	},

	triangle_triangle ()
	{
		var n = 1

		var a = Bud()

		var b1 = join(a, a => a + 1)
		var c1 = join(a, b1, (a, b) => a + b + 1)

		var b2 = join(b1, b => b + 1)
		var c2 = join(b2, c1, (b, c) => b + c + 1)

		c2.on(() => n++)

		return () =>
		{
			a.emit(17)
		}
	},
}
