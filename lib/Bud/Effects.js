
import def from 'def-prop'
import val from 'def-prop/val'

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
		if (! fns) { return }
		/* if (! fns.length) { return } */

		const { value } = bud

		for (const fn of fns)
		{
			fn(value)
		}

		if (value === End)
		{
			fns = null
		}
	}))

	return on
}
