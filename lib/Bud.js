
import def from 'def-prop'
var { val } = def
var { getset } = def


import { Next } from './realm'

import Nothing from './Nothing'

import order from './Bud/order'

import emit from './Bud/emit'
import Effects from './Bud/Effects'
import map from './Bud/map'
import thru from './Bud/thru'

// import { log } from './realm'


var kind = Symbol('Bud')


export default function Bud ()
{
	var bud = {}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	bud.id = Next()

	bud.value = Nothing

	def(bud, 'deps', val([]))
	def(bud, 'order', getset(order(bud)))

	def(bud, 'emit', val(emit(bud)))
	def(bud, 'on', val(Effects(bud)))
	def(bud, 'map', val(map(bud)))
	def(bud, 'thru', val(thru(bud)))

	// log()
	// log('    INIT', bud)

	return bud
}
