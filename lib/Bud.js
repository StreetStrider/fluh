
import def from 'def-prop'

var { val } = def

import Nothing from './Nothing'

export default function Bud ()
{
	var bud = {}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	bud.value = Nothing

	def(bud, 'emit', val(function emit (value)
	{
		bud.value = value

		console.log('v', value)
	}))

	return bud
}

var kind = Symbol('Bud')
