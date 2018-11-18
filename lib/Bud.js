
import def from 'def-prop'
var { val } = def

import Nothing from './Nothing'

import { Next } from './realm'
import { Deps } from './realm'

import emit from './emit'

export default function Bud (efn)
{
	var bud = {}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	bud.id = Next()

	bud.value = Nothing

	def(bud, 'eval', val(function ()
	{
		bud.value = efn()
		console.log('eval', bud.id, bud.value)
	}))

	def(bud, 'emit', val(emitter(bud)))

	return bud
}


var kind = Symbol('Bud')


function emitter (bud)
{
	return (value) =>
	{
		return emit(bud, value)
	}
}
