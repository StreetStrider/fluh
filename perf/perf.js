
import graph from './graph.perf'
import flyd  from './flyd.perf'

import { Suite } from 'benchmark'


var suite = Suite()

graph(suite)
flyd(suite)

suite.on('cycle', (event) =>
{
	console.log(String(event.target))
})
.on('error', (event) =>
{
	console.error(event.target.error)
})
.run()
