
import def from 'def-prop'
var { val } = def

import Nothing from './Nothing'

import { log } from './realm'
import inspect from './inspect'


export default function Effects (bud)
{
	var fns = []

	function on (fn)
	{
		log.enabled && log('    ON', bud, fn)

		fns.push(fn)

		var value = bud.value
		if (value !== Nothing)
		{
			log.enabled && log('    EFFECT', inspect(value), bud)

			fn(value)
		}
	}

	def(on, 'emit', val(function emit ()
	{
		var value = bud.value

		log.enabled && log('    EFFECTS', inspect(value), bud)

		fns.forEach(fn => fn(value))
	}))

	return on
}
