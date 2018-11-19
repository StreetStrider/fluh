
import Noop from './Noop'
import Nothing from './Nothing'
import { update } from './realm'
import { log } from './realm'


export default function evaluate (bud, efn)
{
	efn || (efn = Noop)

	return () =>
	{
		var value = efn()

		if (value !== Nothing)
		{
			log('ev*', value, bud)

			bud.value = value

			update(bud)
		}
		else
		{
			log('ev noop', bud)
		}
	}
}
