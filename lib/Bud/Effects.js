
import def from 'def-prop'
var { val } = def

import Nothing from '../Nothing'
import End from '../End'


export default function Effects (bud)
{
	var fns = null

	function on (fn)
	{
		const { value } = bud

		if (value !== End)
		{
			if (! fns)
			{
				fns = []
			}

			fns.push(fn)
		}

		if (value !== Nothing)
		{
			fn(value)
		}

		return bud
	}

	def(on, 'emit', val(function emit ()
	{
		if (! fns)
		/* if (! fns.length) */
		{
			return bud
		}

		const { value } = bud

		for (const fn of fns)
		{
			fn(value)
		}

		if (value === End)
		{
			fns = null
		}

		return bud
	}))

	return on
}
