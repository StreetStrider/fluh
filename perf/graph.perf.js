
import Benchmark from 'benchmark'
import { Suite } from 'benchmark'


import Bud from '../lib/Bud'
import join from '../lib/join'

global.Bud  = Bud
global.join = join

Suite()
.add('              diamond',
{
	setup ()
	{
		var a = Bud()
		var b = a.map(a => a + 1)
		var c = b.map(b => b + 1)
		var d = join(a, c, (a, c) => a + c + 1)
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
	},
	fn ()
	{
		a.emit(17)
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
