
import def from 'def-prop'
var { val } = def

import Nothing from './Nothing'

import { Next } from './realm'

import pull from './pull'
import emitter from './emitter'

var kind = Symbol('Bud')


export default function Bud (efn)
{
	var bud = {}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	bud.id = Next()

	bud.value = Nothing

	def(bud, 'pull', val(pull(bud, efn)))
	def(bud, 'emit', val(emitter(bud)))

	bud.pull()

	return bud
}
