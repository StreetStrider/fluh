/* eslint complexity: [ 2, 7 ] */

import Nothing from './Nothing'
import End from './End'

import domain from './domain'

var affected_now = domain.queue.affected_now


export default function merge (...buds)
{
	var bud1 = buds[0]

	var value = pick(buds, true)
	var dep   = bud1.constructor(value)

	if (value !== End)
	{
		/* compute function: */
		var compute = Pick(buds)

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


function Pick (buds)
{
	return () =>
	{
		return pick(buds)
	}
}


function pick (buds, any_touched = false)
{
	var L = buds.length

	if (L === 1)
	{
		var bud = buds[0]
		var value = bud.value

		if (value === Nothing)
		{
			return Nothing
		}
		/*
		if (! (any_touched || affected_now(bud)))
		{
			return false
		}
		*/

		return value
	}

	for (var n = 0; (n < L); n++)
	{
		var bud = buds[n]
		var value = bud.value

		if (value === Nothing)
		{
			continue
		}
		if (! (any_touched || affected_now(bud)))
		{
			continue
		}

		return value
	}

	/*
	if (! any_touched)
	{
		return false
	}
	*/

	return Nothing
}
