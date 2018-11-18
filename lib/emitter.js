
import order from './order'
import Nothing from './Nothing'


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

	var ord = order(bud)

	console.log('emit', ord)

	ord.forEach(bud => bud.eval())

	return bud
}
