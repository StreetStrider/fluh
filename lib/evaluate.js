
import Nothing from './Nothing'
import { mark } from './realm'
import { Deps } from './realm'


export default function evaluate (bud, efn)
{
	return () =>
	{
		var value = efn()

		if (value !== Nothing)
		{
			bud.value = value

			console.log('evaluate', bud.id, bud.value)
			mark(Deps(bud))
		}
		else
		{
			console.log('evaluate: noop')
		}
	}
}
