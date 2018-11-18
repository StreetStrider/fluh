
import def from 'def-prop'

var { val } = def

import Nothing from './Nothing'

import { Next } from './realm'
import { Deps } from './realm'

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

// 	def(bud, 'emit', val(function emit (value)
// 	{
// 		bud.value = value
// 
// 		console.log('v', value, Deps(bud))
// 	}))

	return bud
}

var kind = Symbol('Bud')
