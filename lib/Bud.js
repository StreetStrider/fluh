
import def from 'def-prop'
var { val } = def
var { getset } = def


import { Next } from './realm'

import Nothing from './Nothing'
import Noop from './Noop'

import order from './order'

import emit from './emit'
import Effects from './Effects'
import map from './map'

import pull from './pull'

import { log } from './realm'


var kind = Symbol('Bud')


export default function Bud (efn = Noop)
{
	var bud = {}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	bud.id = Next()

	bud.value = Nothing

	def(bud, 'efn', val(efn))
	def(bud, 'deps', val([]))
	def(bud, 'order', getset(order(bud)))

	def(bud, 'emit', val(emit(bud)))
	def(bud, 'on', val(Effects(bud)))
	def(bud, 'map', val(map(bud)))

	log()
	log('    INIT', bud)
	pull(bud)

	return bud
}
