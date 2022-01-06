// TODO: import from index in perf & test

import Bud from '../lib/Bud'
import Nothing from '../lib/Nothing'
import Many from '../lib/Many'

import join  from '../lib/join'
import merge from '../lib/merge'


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

	merge ()
	{
		var n = 1

		var a = Bud()
		var b = Bud()
		var c = merge(a, b)

		c.on(() => n++)

		return () =>
		{
			b.emit(17)
			a.emit(-1)
		}
	},

	deep_linear ()
	{
		var n = 1

		var a = Bud()

		var b = a
		for (var n = 0; n < 100; n++)
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
		for (var n = 0; n < 100; n++)
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

	shortcut ()
	{
		var n = 1

		var a = Bud()

		var b = a
		for (var n = 0; n < 100; n++)
		{
			if (n === 10)
			{
				b = join(b, b => ((b % 2) && (b + 1) || Nothing))
			}
			else
			{
				b = join(b, b => b + 1)
			}
		}

		b.on(() => n++)

		return () =>
		{
			a.emit(18)
			a.emit(17)
		}
	},
}
