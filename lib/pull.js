
import Noop from './Noop'
import Nothing from './Nothing'

import { log } from './realm'
import inspect from './inspect'


export default function pull (bud, efn)
{
	efn || (efn = Noop)

	return () =>
	{
		var value = efn(bud)

		if (value !== Nothing)
		{
			log.enabled && log('    PULL', inspect(value), 'INTO', bud)

			bud.value = value

			bud.on.emit()
		}
		else
		{
			log.enabled && log('    PULL Nothing', bud)
		}

		return value
	}
}
