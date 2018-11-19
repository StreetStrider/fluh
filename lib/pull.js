
import { inspect } from 'util'

import Noop from './Noop'
import Nothing from './Nothing'
import { update } from './realm'
import { log } from './realm'


export default function pull (bud, efn)
{
	efn || (efn = Noop)

	return () =>
	{
		var value = efn()

		if (value !== Nothing)
		{
			log.enabled && log('    PULL', inspect(value, { colors: true }), 'INTO', bud)

			bud.value = value

			update(bud)
		}
		else
		{
			log.enabled && log('    PULL Nothing', bud)
		}

		return value
	}
}
