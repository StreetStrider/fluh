/* global a */


import { Suite } from 'benchmark'


import Bud  from '../lib/Bud'
import join from '../lib/join'
import Many from '../lib/Many'

global.Bud  = Bud
global.join = join
global.Many = Many

Suite()
.add('              diamond',
{
	setup ()
	{
		var a = Bud()
		var b = join(a, a => a + 1)
		var c = join(b, b => b + 1)
		var d = join(a, c, (a, c) => a + c + 1)

		d.on(() => void 0)
	},
	fn ()
	{
		a.emit(17)
	},
})
.add(' triangle in triangle',
{
	setup ()
	{
		var a = Bud()

		var b1 = join(a, a => a + 1)
		var c1 = join(a, b1, (a, b) => a + b + 1)

		var b2 = join(b1, b => b + 1)
		var c2 = join(b2, c1, (b, c) => b + c + 1)

		c2.on(() => void 0)
	},
	fn ()
	{
		a.emit(17)
	},
})
.add('          deep linear',
{
	setup ()
	{
		var a = Bud()

		var b = a
		for (let n = 0; n < 100; n++)
		{
			b = join(b, b => b + 1)
		}
	},
	fn ()
	{
		a.emit(17)
	},
})
.add('     deep linear Many',
{
	setup ()
	{
		var a = Bud()

		var b = a
		for (let n = 0; n < 100; n++)
		{
			b = join(b, b => b + 1)
		}
		b.on(() => void 0)
	},
	fn ()
	{
		a.emit(Many(17, 1917))
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
