
import Bud from './Bud'
import Nothing from './Nothing'

// import { log } from './realm'


export default function join (...args)
{
	var buds = args.slice(0, -1)
	var fn   = args[args.length - 1]

	var dependent = Bud(unwind(buds, fn))

	buds.forEach(bud => bud.deps.push(dependent))

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
			// log('    JOIN MISS')

			return false
		}
	}

	return args
}
