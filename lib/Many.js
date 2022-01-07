
import def from 'def-prop'
import val from 'def-prop/val'

var kind = Symbol('Many')


export default function Many (...many)
{
	def(many, kind, val(Many))
	def(many, 'constructor', val(Many))

	return many
}

Many.is = (it) =>
{
	return (kind in Object(it))
}
