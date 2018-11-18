
import order from './order'
import Nothing from './Nothing'
import { update } from './realm'
import { queue } from './realm'


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
		console.log('emit: noop')
		return
	}

	bud.value = value

	console.log('emit', order(bud))
	update(bud)
	queue(order(bud))

	return bud
}
