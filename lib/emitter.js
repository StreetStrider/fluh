
import order from './order'
import Nothing from './Nothing'
import { mark } from './realm'
import { Deps } from './realm'
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
	mark(Deps(bud))
	queue(order(bud))

	return bud
}
