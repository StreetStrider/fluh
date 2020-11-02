
import { add } from 'benny'

import { stream } from 'flyd'
import { combine } from 'flyd'
import { on } from 'flyd'


export default
[
	add('diamond (flyd)', () =>
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
	}),

	add('deep linear (flyd)', () =>
	{
		var n = 1

		var a = stream()

		var b = a
		for (let n = 0; n < 100; n++)
		{
			b = combine(b => b + 1, [ b ])
		}

		on(() => n++, b)

		return () =>
		{
			a(17)
		}
	}),
]
