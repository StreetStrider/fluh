
import def from 'def-prop'
var { val } = def

import Nothing from '../Nothing'

import { log } from '../realm'


export default function Effects (bud)
{
	var fns = null

	function on (fn)
	{
		log.enabled && log('    ON', bud, fn)

		fns || (fns = [])

		fns.push(fn)

		var value = bud.value
		if (value !== Nothing)
		{
			log('    EFFECT', log.inspect(value), bud)

			fn(value)
		}
	}

	def(on, 'emit', val(function emit ()
	{
		if (! fns) { return }
		if (! fns.length) { return }

		var value = bud.value

		log('    EFFECTS', log.inspect(value), bud)

		fns.forEach(fn => fn(value))
	}))

	return on
}
