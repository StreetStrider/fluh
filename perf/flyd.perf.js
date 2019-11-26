
import { add } from 'benny'

import Bud  from '../lib/Bud'
import join from '../lib/join'

import { stream } from 'flyd'
import { combine } from 'flyd'
import { on } from 'flyd'


export default
[
	add('diamond (fluh)', () =>
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
	}),

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
