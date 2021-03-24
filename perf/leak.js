/* eslint-disable no-debugger */

var { Bud } = require('../release/npm')
var { join } = require('../release/npm')
var { End } = require('../release/npm')

var { when_data } = require('../release/npm/map/when')
var { when_data_all } = require('../release/npm/map/when')

// var domain = require('../release/npm/lib/domain')

var plus = when_data_all((x, y) => (x + (y || 0) + 1))

var t = 0

var iters = (1000e3)
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

	let ds = c2.on(when_data((x) => { t += x }))

	a.emit(1)
	a.emit(End)
	ds()
}

console.log('total', t)

if (brk) debugger

t = 0

for (let n = 1; (n <= iters); n++)
{
	let a = Bud()
	let b = a

	for (let n = 1; (n <= 10); n++)
	{
		b = b.map(plus)
	}

	let c = b

	let ds = c.on(when_data((x) => { t += x }))

	a.emit(1)
	a.emit(End)
	ds()
}

console.log('total', t)

if (brk) debugger
