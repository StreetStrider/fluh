
import Bud from './Bud'
import Nothing from './Nothing'

// import { log } from './realm'


export default function join (...args)
{
	const buds = args.slice(0, -1)
	const fn   = args[args.length - 1]

	var dependent = Bud(unwind(buds, fn))

	for (const bud of buds)
	{
		bud.deps.push(dependent)
	}

	return dependent
}


function unwind (buds, fn)
{
	return (/* bud */) =>
	{
		// log('    JOIN FROM', buds.map(bud => bud.id), 'FOR', bud)

		var args = collect(buds)

		if (args)
		{
			// log('    =', args)

			var result = fn(...args)

			// log('    >', log.inspect(result))

			return result
		}

		return Nothing
	}
}

function collect (buds)
{
	const L = buds.length
	var args = Array(L)

	for (let n = 0; (n < L); n++)
	{
		const value = buds[n].value

		if (value !== Nothing)
		{
			args[n] = value
		}
		else
		{
			// log('    JOIN MISS')

			return false
		}
	}

	return args
}
