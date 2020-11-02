
import graph from './graph.perf'
import flyd  from './flyd.perf'
import rxjs  from './rxjs.perf'

import { suite } from 'benny'
import { cycle, complete, save } from 'benny'


suite(
	'fluh',

	...graph,
	...flyd,
	...rxjs,

	cycle(),

	complete(),

	save(
	{
		file: 'perf',
		folder: '.',
		format: 'chart.html',
	}),
)
