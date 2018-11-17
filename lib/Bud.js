
import def from 'def-prop'

var { val } = def

export default function Bud ()
{
	var bud = {}

	def(bud, kind, val(Bud))
	def(bud, 'constructor', val(Bud))

	return bud
}

var kind = Symbol('Bud')
