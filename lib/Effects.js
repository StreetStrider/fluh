
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
		log('    ON', bud, fn)

		fns.push(fn)

		var value = bud.value
		if (value !== Nothing)
		{
			log('    EFFECT', inspect(value), bud)

			fn(value)
		}
	}

	def(on, 'emit', val(function emit ()
	{
		var value = bud.value

		log('    EFFECT', inspect(value), bud)

		fns.forEach(fn => fn(value))
	}))

	return on
}
