
import Nothing from './Nothing'


export default function evaluate (bud, efn)
{
	return () =>
	{
		var value = efn()

		if (value !== Nothing)
		{
			bud.value = value

			console.log('evaluate', bud.id, bud.value)
		}
	}
}
