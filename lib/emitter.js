
import order from './order'


export default function emitter (bud)
{
	return (value) =>
	{
		return emit(bud, value)
	}
}


export function emit (bud, value)
{
	var ord = [ bud ].concat(order(bud))

	console.log('emit', ord)
}
