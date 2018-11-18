
import order from './order'


export default function emit (bud, value)
{
	var ord = [ bud ].concat(order(bud))

	console.log('emit', ord)
}
