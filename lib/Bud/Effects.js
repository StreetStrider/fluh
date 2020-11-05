
import def from 'def-prop'
import val from 'def-prop/val'

import Nothing from '../Nothing'
import End from '../End'


export default function Effects (bud)
{
	var fns = null

	function on (fn)
	{
		var { value } = bud

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

		return function ds ()
		{
			if (! fn)  { return }
			if (! fns) { return }

			var index = fns.indexOf(fn)
			fn = null

			fns.splice(index, 1)
		}
	}

	def(on, 'emit', val(function emit ()
	{
		if (! fns) { return }

		var { value } = bud

		for (var fn of fns)
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
