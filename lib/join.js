/* eslint complexity: [ 2, 6 ] */

import Nothing from './Nothing'
import End from './End'

import domain from './domain'

var affected_now = domain.queue.affected_now


export default function join (...args)
{
	var buds = args.slice(0, -1)
	var fn   = args[args.length - 1]

	var bud1 = buds[0]

	var value = compute_initial(buds, fn)
	var dep   = bud1.constructor(value)

	if (value !== End)
	{
		/* compute function: */
		var compute = Compute(buds, fn)

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


function compute_initial (buds, fn)
{
	var args = collect(buds, true)

	if (! args)
	{
		return Nothing
	}

	return fn(...args)
}

function Compute (buds, fn)
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


function collect (buds, any_touched = false)
{
	var L    = buds.length
	var args = Array(L)

	for (var n = 0; (n < L); n++)
	{
		var bud = buds[n]
		var { value } = bud

		if (value === Nothing)
		{
			return false
		}

		any_touched || (any_touched = affected_now(bud))

		args[n] = value
	}

	if (! any_touched)
	{
		return false
	}

	return args
}
