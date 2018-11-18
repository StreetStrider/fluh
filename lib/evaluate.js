
import Nothing from './Nothing'
import { update } from './realm'


export default function evaluate (bud, efn)
{
	return () =>
	{
		var value = efn()

		if (value !== Nothing)
		{
			bud.value = value

			console.log('evaluate', bud.id, bud.value)
			update(bud)
		}
		else
		{
			console.log('evaluate: noop')
		}
	}
}
