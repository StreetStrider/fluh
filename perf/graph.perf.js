
import Benchmark from 'benchmark'
import { Suite } from 'benchmark'


import Bud from '../lib/Bud'
import join from '../lib/join'

global.Bud  = Bud
global.join = join

Suite()
.add('graph',
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
.on('cycle', (event) =>
{
	console.log(String(event.target))
})
.on('error', (event) =>
{
	console.error(event.target.error)
})
.run()
