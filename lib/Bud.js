
import def from 'def-prop'
var { val } = def

import Nothing from './Nothing'

import { Next } from './realm'
import { Deps } from './realm'

import evaluate from './evaluate'
import emitter from './emitter'

var kind = Symbol('Bud')


export default function Bud (efn)
{
	var bud = {}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	bud.id = Next()

	bud.value = Nothing

	def(bud, 'evaluate', val(evaluate(bud, efn)))
	def(bud, 'emit', val(emitter(bud)))

	return bud
}
