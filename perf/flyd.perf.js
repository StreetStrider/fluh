
import { stream } from 'flyd'
import { combine } from 'flyd'
import { merge } from 'flyd'
import { on } from 'flyd'

import filter from 'flyd/module/filter'


export default
{
	diamond ()
	{
		var n = 1

		var Af = stream()
		var b = combine(a => a + 1, [ Af ])
		var c = combine(b => b + 1, [ b ])
		var d = combine((a, c) => a + c + 1, [ Af, c ])

		on(() => n++, d)

		return () =>
		{
			Af(17)
		}
	},

	merge ()
	{
		var n = 1

		var a = stream()
		var b = stream()
		var c = merge(a, b)

		on(() => n++, c)

		return () =>
		{
			b(17)
			a(-1)
		}
	},

	deep_linear ()
	{
		var n = 1

		var a = stream()

		var b = a
		for (var n = 0; n < 100; n++)
		{
			b = combine(b => b + 1, [ b ])
		}

		on(() => n++, b)

		return () =>
		{
			a(17)
		}
	},

	triangle_triangle ()
	{
		var n = 1

		var a = stream()

		var b1 = combine(a => a + 1, [ a ])
		var c1 = combine((a, b) => a + b + 1, [ a, b1 ])

		var b2 = combine(b => b + 1, [ b1 ])
		var c2 = combine((b, c) => b + c + 1, [ b2, c1 ])

		on(() => n++, c2)

		return () =>
		{
			a(17)
		}
	},

	shortcut ()
	{
		var n = 1

		var a = stream()

		var b = a
		for (var n = 0; n < 100; n++)
		{
			if (n === 10)
			{
				b = filter(b => Boolean(b % 2), b)
			}
			else
			{
				b = combine(b => b + 1, [ b ])
			}
		}

		on(() => n++, b)

		return () =>
		{
			a(18)
			a(17)
		}
	},
}
