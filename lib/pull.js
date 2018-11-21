
import Noop from './Noop'
import Nothing from './Nothing'

import { log } from './realm'
import inspect from './inspect'


export default function (bud, efn)
{
	return () =>
	{
		return pull(bud, efn)
	}
}


function pull (bud, efn = Noop)
{
	var value = efn(bud)

	if (value === Nothing)
	{
		log.enabled && log('    PULL Nothing', bud)

		return value
	}

	log.enabled && log('    PULL', inspect(value), 'INTO', bud)

	bud.value = value

	bud.on.emit()

	return value
}
