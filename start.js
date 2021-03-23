
import { Bud } from '.'
import { when_data } from './map/when'
import { End } from '.'

import domain from './lib/domain'

function state (bud)
{
	console.log(bud.id, bud.value, domain.state(bud))
}

var a1 = Bud()
a1.id = '#a1'
var b1 = a1.map(when_data(x => x + 1))
b1.id = '#b1'

var a2 = Bud()
a2.id = '#a2'
var b2 = a2.map(when_data(x => x + 1))
b2.id = '#b2'

a1.emit(1)
a2.emit(1)

a1.emit(End)
a2.emit(End)

state(a1)
state(b1)
state(a2)
state(b2)
