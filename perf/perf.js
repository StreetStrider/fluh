
import graph from './graph.perf'
import flyd  from './flyd.perf'

import { suite } from 'benny'
import { cycle, complete, save } from 'benny'


suite(
	'fluh',

	...graph,
	...flyd,

	cycle(),

	complete(),

	save(
	{
		file: 'perf',
		folder: '.',
		format: 'chart.html',
	}),
)
