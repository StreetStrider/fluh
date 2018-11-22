
import def from 'def-prop'
var { val } = def


var kind = Symbol('Many')


export default function Many (...many)
{
	def(many, kind, val(Many))
	def(many, 'constructor', val(Many))

	return many
}


Many.is = (it) =>
{
	return (it && (kind in it))
}