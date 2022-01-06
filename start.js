
import { Bud } from '.'
// import { when_data } from './map/when'
// import { End } from '.'
import { merge } from '.'

import domain from './lib/_/domain'

function state (bud)
{
	console.log(bud.id, bud.value, domain.state(bud))
}

var a1 = Bud()
var a2 = Bud()

var b = merge(a1, a2)

console.log('b', b.value)

b.on(x => console.log('x', x))

a1.emit(1)
a2.emit(2)
a1.emit(3)

state(a1)
state(a2)
state(b)
