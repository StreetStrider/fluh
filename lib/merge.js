/* eslint complexity: [ 2, 9 ] */

import Nothing from './Nothing'
import Many from './Many'
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

		return value
	}

	var any = Nothing
	var all = []

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

		any = value
		all.push(value)
	}

	switch (all.length)
	{
	case 0: return Nothing
	case 1: return any
	default: return Many(...all)
	}
}
