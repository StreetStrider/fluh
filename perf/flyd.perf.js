/* global A */
/* global a */
/* global Af */

import Bud  from '../lib/Bud'
import join from '../lib/join'

global.Bud  = Bud
global.join = join

import { stream } from 'flyd'
import { combine } from 'flyd'
import { on } from 'flyd'

global.stream = stream
global.combine = combine
global.on = on


export default function (suite)
{
	return suite
	.add('         diamond fluh',
	{
		setup ()
		{
			var n = 1

			var A = Bud()
			var b = join(A, a => a + 1)
			var c = join(b, b => b + 1)
			var d = join(A, c, (a, c) => a + c + 1)

			d.on(() => n++)
		},
		fn ()
		{
			A.emit(17)
		},
	})
	.add('         diamond flyd',
	{
		setup ()
		{
			var n = 1

			var Af = stream()
			var b = combine(a => a + 1, [ Af ])
			var c = combine(b => b + 1, [ b ])
			var d = combine((a, c) => a + c + 1, [ Af, c ])

			on(() => n++, d)
		},
		fn ()
		{
			Af(17)
		},
	})
	.add('     deep linear flyd',
	{
		setup ()
		{
			var n = 1

			var a = stream()

			var b = a
			for (let n = 0; n < 100; n++)
			{
				b = combine(b => b + 1, [ b ])
			}

			on(() => n++, b)
		},
		fn ()
		{
			a(17)
		},
	})
}
