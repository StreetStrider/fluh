
import Nothing from './Nothing'

import { log } from './realm'
import inspect from './inspect'


export default function propagate (bud, value)
{
	if (value === Nothing)
	{
		log.enabled && log('    PROPAGATE Nothing', bud)

		return false
	}

	log.enabled && log('    PROPAGATE', inspect(value), 'INTO', bud)

	bud.value = value
	bud.on.emit()

	return true
}
