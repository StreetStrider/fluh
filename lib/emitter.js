
import order from './order'
import Nothing from './Nothing'
import { propagate } from './realm'
import { queue } from './realm'
import { log } from './realm'
import inspect from './inspect'


export default function emitter (bud)
{
	return (value) =>
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

	log('    EMIT', inspect(value), 'FROM', bud)

	bud.value = value

	propagate(bud)
	queue(order(bud))

	return bud
}
