// https://github.com/maverick-js/observables TODO

import { add } from 'benny'
import { suite } from 'benny'
import { cycle, complete } from 'benny'

import fluh from './fluh.perf'
import flyd from './flyd.perf'
import rxjs from './rxjs.perf'
import most from './most.perf'


xSuite()

async function benchmark ()
{

await Suite('zero',
[
	add('zero', () =>
	{
		var n = 1
		var emit = (m) => { n = (n * m) }
		return () =>
		{
			emit(-1)
		}
	}),
])

await xSuite('special',
[
	add('deep linear', fluh.deep_linear),
	add('deep linear many', fluh.deep_linear_many),
])

await Suite('diamond',
[
	add('diamond (FLUH)', fluh.diamond),
	add('diamond (flyd)', flyd.diamond),
	add('diamond (most)', most.diamond),
	add('diamond (rxjs)', rxjs.diamond),
])

await Suite('merge',
[
	add('merge (FLUH)', fluh.merge),
	add('merge (flyd)', flyd.merge),
	add('merge (most)', most.merge),
	add('merge (rxjs)', rxjs.merge),
])

await Suite('deep_linear',
[
	add('deep linear (FLUH)', fluh.deep_linear),
	add('deep linear (flyd)', flyd.deep_linear),
	add('deep linear (most)', most.deep_linear),
	add('deep linear (rxjs)', rxjs.deep_linear),
])

await Suite('triangle_triangle',
[
	add('triangle in triangle (FLUH)', fluh.triangle_triangle),
	add('triangle in triangle (flyd)', flyd.triangle_triangle),
	add('triangle in triangle (most)', most.triangle_triangle),
	add('triangle in triangle (rxjs)', rxjs.triangle_triangle),
])

await Suite('shortcut',
[
	add('shortcut (FLUH)', fluh.shortcut),
	add('shortcut (flyd)', flyd.shortcut),
	add('shortcut (most)', most.shortcut),
	add('shortcut (rxjs)', rxjs.shortcut),
])

}


function xSuite () {}

function Suite (name, cases)
{
	return suite(
		name,
		...cases,

		cycle(),
		complete(),
		/*save(
		{
			folder: 'perf/chart',
			file:   name,
			format: 'chart.html',
		}),*/
	)
}


benchmark()
