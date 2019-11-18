// TODO: turnoff & cleanup

import { Bud }  from '.'
import { End }  from '.'

import { when_data } from './map/when'
import { when_end }  from './map/when'

var a = Bud()
.on(tap('a'))

var b = a
.map(when_data(x => (x + 1)))
.on(tap('b'))


turnoff(b, a)

a.emit(1).emit(2)
b.emit(400).emit(End)


function turnoff (a, b)
{
	return a.on(when_end(b.emit))
}

function tap (label)
{
	return (x) => (console.log(label, x), x)
}
