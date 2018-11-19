
import Bud from './Bud'
import { Deps } from './realm'
import { log } from './realm'
import Nothing from './Nothing'
import inspect from './inspect'


export default function join (buds, fn)
{
	var dependent = Bud(unwind(buds, fn))

	buds.forEach(bud => Deps(bud).push(dependent))

	return dependent
}


function unwind (buds, fn)
{
	return () =>
	{
		var L = buds.length
		var args = Array(L)

		for (let n = 1; (n <= L); n++)
		{
			let value = buds[n - 1].value

			if (value !== Nothing)
			{
				args[n - 1] = value
			}
			else
			{
				log.enabled && log('    JOIN some miss')

				args = false
				break
			}
		}

		if (args)
		{
			log.enabled && log('    JOIN values', args, 'FROM', buds.map(bud => bud.id))

			var result = fn(...args)

			log.enabled && log('    >', inspect(result))

			return result
		}

		return Nothing
	}
}
