
import def from 'def-prop'
var { val } = def

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

	const L = value.length
	let recent = Nothing

	for (let n = 0; (n < L); n++)
	{
		const next = value[n]

		if (next !== Nothing)
		{
			recent = next
		}
	}

	return recent
}
