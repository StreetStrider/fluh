
import def from 'def-prop'
import val from 'def-prop/val'

import Nothing from './Nothing'

import domain  from './_/domain'

import sample  from './_/Bud/sample'
import emit    from './_/Bud/emit'
import Effects from './_/Bud/Effects'
import map     from './_/Bud/map'
import thru    from './_/Bud/thru'
import debug   from './_/Bud/debug'

var kind = Symbol('Bud')


export default function Bud (value)
{
	var bud =
	{
		id: ('#' + domain.id++),
		value: Nothing,
	}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	def(bud, 'sample', val(sample(bud)))

	def(bud, 'emit', val(emit(bud)))
	def(bud, 'on', val(Effects(bud)))
	def(bud, 'map', val(map(bud)))
	def(bud, 'thru', val(thru(bud)))

	def(bud, 'debug', val(debug(bud)))

	if (arguments.length)
	{
		bud.emit(value)
	}

	return bud
}

Bud.is = (value) =>
{
	return (kind in Object(value))
}
