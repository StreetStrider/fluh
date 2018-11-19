
import Bud from './Bud'
import { Deps } from './realm'
import { log } from './realm'
import Nothing from './Nothing'
import inspect from './inspect'


export default function join (...args)
{
	var buds = args.slice(0, -1)
	var fn   = args[args.length - 1]

	var dependent = Bud(unwind(buds, fn))

	buds.forEach(bud => Deps(bud).push(dependent))

	return dependent
}


function unwind (buds, fn)
{
	return (bud) =>
	{
		var args = collect(buds, bud)

		if (args)
		{
			log.enabled && log('    JOIN', args, 'FROM', buds.map(bud => bud.id))

			var result = fn(...args)

			log.enabled && log('    >', inspect(result), bud)

			return result
		}

		return Nothing
	}
}

function collect (buds, bud)
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
			log.enabled && log('    JOIN MISS', bud)

			return false
		}
	}

	return args
}
