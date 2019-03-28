/* global A */
/* global Af */

import { Suite } from 'benchmark'

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


Suite()
.add('              diamond fluh',
{
	setup ()
	{
		var A = Bud()
		var b = join(A, a => a + 1)
		var c = join(b, b => b + 1)
		var d = join(A, c, (a, c) => a + c + 1)

		d.on(() => void 0)
	},
	fn ()
	{
		A.emit(17)
	},
})
.add('              diamond flyd',
{
	setup ()
	{
		var Af = stream()
		var b = combine(a => a + 1, [ Af ])
		var c = combine(b => b + 1, [ b ])
		var d = combine((a, c) => a + c + 1, [ Af, c ])

		on(() => void 0, d)
	},
	fn ()
	{
		Af(17)
	},
})
.on('cycle', (event) =>
{
	console.log(String(event.target))
})
.on('error', (event) =>
{
	console.error(event.target.error)
})
.run()
