
import Nothing from './Nothing'
import { queue } from './realm'

import { log } from './realm'
import inspect from './inspect'


export default function (bud)
{
	return (value = Nothing) =>
	{
		return emit(bud, value)
	}
}


export function emit (bud, value)
{
	if (value === Nothing)
	{
		log('    EMIT Nothing', bud)

		return bud
	}

	log.enabled && log('    EMIT', inspect(value), 'FROM', bud)

	queue(bud, value)

	return bud
}
