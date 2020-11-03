
import graph from './graph.perf'
import flyd  from './flyd.perf'
import rxjs  from './rxjs.perf'
import most  from './mostjs.perf'

import { suite } from 'benny'
import { cycle, complete, save } from 'benny'


suite(
	'fluh',

	...graph,
	...flyd,
	...rxjs,
	...most,

	cycle(),

	complete(),

	save(
	{
		file: 'perf',
		folder: '.',
		format: 'chart.html',
	}),
)
