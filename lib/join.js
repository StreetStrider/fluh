/* eslint complexity: [ 2, 9 ] */

import Nothing from './Nothing'
import End from './End'

import domain from './domain'

var affected_now = domain.affected.is_now


export default function join (...args)
{
	var buds = args.slice(0, -1)
	var fn   = args[args.length - 1]

	var bud1 = buds[0]

	var value = collect(buds, fn, true)
	var dep   = bud1.constructor(value)

	if (value !== End)
	{
		/* compute function: */
		var compute = Collect(buds, fn)

		/* collect direct & reverse deps: */
		var deps = []

		for (var bud of buds)
		{
			if (bud.value !== End)
			{
				domain.deps.direct.add(bud, dep)

				deps.push(bud)
			}
		}

		domain.deps.reverse.add(dep, { compute, deps })
	}

	return dep
}


function Collect (buds, fn)
{
	if (buds.length === 1)
	{
		var bud = buds[0]

		return () =>
		{
			return collect_only(bud, fn)
		}
	}
	else
	{
		return () =>
		{
			return collect(buds, fn)
		}
	}
}


function collect_only (bud, fn, any_touched = false)
{
	var value = bud.value

	if (value === Nothing)
	{
		return Nothing
	}
	if (! (any_touched || affected_now(bud)))
	{
		return Nothing
	}

	return fn(value)
}

function collect (buds, fn, any_touched = false)
{
	var L = buds.length
	var args = []

	for (var n = 0; (n < L); n++)
	{
		var bud = buds[n]
		var value = bud.value

		if (value === Nothing)
		{
			return Nothing
		}

		any_touched || (any_touched = affected_now(bud))

		args.push(value)
	}

	if (! any_touched)
	{
		return Nothing
	}

	return fn(...args)
}
