
import def from 'def-prop'
var { val } = def

import Nothing from '../Nothing'

// import { log } from '../realm'


export default function Effects (bud)
{
	var fns = null

	function on (fn)
	{
		// log('    ON', bud, fn)

		fns || (fns = [])

		fns.push(fn)

		var value = bud.value
		if (value !== Nothing)
		{
			// log('    EFFECT', log.inspect(value), bud)

			fn(value)
		}

		return bud
	}

	def(on, 'emit', val(function emit ()
	{
		if (! fns) { return bud }
		// if (! fns.length) { return }

		const { value } = bud

		// log('    EFFECTS', log.inspect(value), bud)

		for (const fn of fns)
		{
			fn(value)
		}

		return bud
	}))

	return on
}
