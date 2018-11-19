
import order from './order'
import Nothing from './Nothing'
import { update } from './realm'
import { queue } from './realm'
import { log } from './realm'


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
		log('emit noop')

		return bud
	}

	log('emit*', value, bud)

	bud.value = value

	update(bud)
	queue(order(bud))

	return bud
}
