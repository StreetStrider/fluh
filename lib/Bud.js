
import def from 'def-prop'
var { val } = def


import { Next } from './realm'

import Nothing from './Nothing'

import pull from './pull'
import emitter from './emitter'

import { log } from './realm'


var kind = Symbol('Bud')


export default function Bud (efn)
{
	var bud = {}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	bud.id = Next()

	bud.value = Nothing
	def(bud, 'deps', val([]))

	def(bud, 'pull', val(pull(bud, efn)))
	def(bud, 'emit', val(emitter(bud)))

	log()
	log('    INIT', bud)
	bud.pull()

	return bud
}
