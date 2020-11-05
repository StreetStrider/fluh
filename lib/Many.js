
import def from 'def-prop'
import val from 'def-prop/val'

import Nothing from './Nothing'


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


Many.last = (value) =>
{
	if (! Many.is(value))
	{
		return value
	}

	var L = value.length
	var recent = Nothing

	for (var n = 0; (n < L); n++)
	{
		var next = value[n]

		if (next !== Nothing)
		{
			recent = next
		}
	}

	return recent
}
