/* eslint-disable @typescript-eslint/no-unused-vars */
/* global gc */

collect()

var { Bud } = require('../release/npm')
var { join } = require('../release/npm')
var { merge } = require('../release/npm')
var { End } = require('../release/npm')

var { when_data } = require('../release/npm/map/when')
var { when_data_all } = require('../release/npm/map/when')

/* var domain = require('../release/npm/lib/domain') */

var plus = when_data_all((x, y) => (x + (y || 0) + 1))

var leak_holder = []

var total = 0

var iters = (100e3)
var brk = true

for (let n = 1; (n <= iters); n++)
{
	let a = Bud()
	a.id = `#a_${ n }`

	let b1 = join(a, plus)
	b1.id = `#b1_${ n }`

	let c1 = join(a, b1, plus)
	c1.id = `#c1_${ n }`

	let b2 = join(b1, plus)
	b2.id = `#b2_${ n }`

	let c2 = join(b2, c1, plus)
	c2.id = `#c2_${ n }`

	let ds = c2.on(when_data((x) => { total += x }))

	a.emit(1)
	// a.emit(End)
	// ds()
	// leak_holder.push(ds)
}

console.log('total #1', total)

collect()

var total = 0

for (let n = 1; (n <= iters); n++)
{
	let a = Bud()
	let b = a

	for (let n = 1; (n <= 10); n++)
	{
		b = b.map(plus)
	}

	let c = b

	let ds = c.on(when_data((x) => { total += x }))

	a.emit(1)
	// a.emit(End)
	// ds()
	// leak_holder.push(ds)
}

console.log('total #2', total)

collect()

var total = 0

for (let n = 1; (n <= iters); n++)
{
	let inputs = []

	for (let n = 1; (n <= 15); n++)
	{
		inputs.push(Bud())
	}

	let c = merge(...inputs)

	let ds = c.on(when_data((x) => { total += x }))

	for (let a of inputs)
	{
		a.emit(1)
	}
	// inputs[0].emit(End)
	// ds()
	// leak_holder.push(ds)
}

console.log('total #3', total)

collect()

leak_holder = null

collect()

// END

function collect ()
{
	gc()
	wait()
	stat()
	// debugger
}

function wait ()
{
	var now = process.hrtime()[0]
	while (process.hrtime()[0] - now < 2) {}
}

function stat ()
{
	/* var heap = v8.getHeapStatistics().used_heap_size */
	var heap = process.memoryUsage().heapUsed
	var heap_mb = (heap / 1000 / 1000)

	console.log('memory', heap_mb.toFixed(2))

	if (heap_mb > 20)
	{
		throw new Error('leak_detected')
	}
}
