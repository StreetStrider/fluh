// TODO: turnoff
// TODO: tap

import { Bud }  from '.'
import { End }  from '.'

import { join } from '.'

import { when_data } from './map/when'
// import { when_end }  from './map/when'

var a = Bud()
.on(tap('a'))

var b = a.map(when_data(hundred))
.on(tap('b'))

join(b, when_data(b => b))
// join(a, b, (a, b) => (a, b))

console.log('deps',  a.deps)
console.log('order', a.order)

// turnoff(b, a)

a
.emit(1)
.emit(2)
.emit(3)
.emit(End)

// b.emit(100).emit(End)


function hundred (x)
{
	return (x + 100)
}

/*
function turnoff (a, b)
{
	return a.on(when_end(b.emit))
}
*/

function tap (label)
{
	return (x) => (console.log(label, x), x)
}
