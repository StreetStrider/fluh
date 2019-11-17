
import def from 'def-prop'
var { val } = def

import Nothing from '../Nothing'


export default function Effects (bud)
{
	var fns = null

	function on (fn)
	{
		fns || (fns = [])

		fns.push(fn)

		const { value } = bud

		if (value !== Nothing)
		{
			fn(value)
		}

		return bud
	}

	def(on, 'emit', val(function emit ()
	{
		if (! fns) { return bud }
		/* if (! fns.length) { return } */

		const { value } = bud

		for (const fn of fns)
		{
			fn(value)
		}

		return bud
	}))

	return on
}
