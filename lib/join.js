
import Bud from './Bud'
import Nothing from './Nothing'

import { dep_fns } from './realm'
// import { log } from './realm'

import { propagate_dependent } from './Queue/propagate'


export default function join (...args)
{
	const buds = args.slice(0, -1)
	const fn   = args[args.length - 1]

	var dep = Bud()

	dep_fns.set(dep, compute(buds, fn))

	propagate_dependent(dep)

	for (const bud of buds)
	{
		bud.deps.push(dep)
	}

	return dep
}


function compute (buds, fn)
{
	return () =>
	{
		var args = collect(buds)

		if (! args)
		{
			return Nothing
		}

		return fn(...args)
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
			return false
		}
	}

	return args
}
