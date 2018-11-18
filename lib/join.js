
import Bud from './Bud'
import { Deps } from './realm'
import Nothing from './Nothing'


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

		for (let n = 1; n <= L; n++)
		{
			let value = buds[n - 1].value

			if (value !== Nothing)
			{
				args[n - 1] = value
			}
			else
			{
				console.log('join: noop')
				args = null
				break
			}
		}

		if (args)
		{
			return fn(...args)
		}

		return Nothing
	}
}
