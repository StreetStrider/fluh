
import def from 'def-prop'
import val from 'def-prop/val'
import getset from 'def-prop/getset'


import domain  from './domain'

import Nothing from './Nothing'
import Many    from './Many'

import order   from './Bud/order'

import sample  from './Bud/sample'
import emit    from './Bud/emit'
import Effects from './Bud/Effects'
import map     from './Bud/map'
import thru    from './Bud/thru'

var kind = Symbol('Bud')


export default function Bud (value)
{
	var bud =
	{
		id: ('#' + domain.Id.next()),
		value: Nothing,
	}

	if (arguments.length)
	{
		bud.value = Many.last(value)
	}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	def(bud, 'sample', val(sample(bud)))

	def(bud, 'deps', val([]))
	def(bud, 'order', getset(order(bud)))

	def(bud, 'emit', val(emit(bud)))
	def(bud, 'on', val(Effects(bud)))
	def(bud, 'map', val(map(bud)))
	def(bud, 'thru', val(thru(bud)))

	return bud
}

Bud.is = (value) =>
{
	return (kind in Object(value))
}
