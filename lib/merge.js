/* eslint complexity: [ 2, 9 ] */

import Nothing from './Nothing'
import Many from './Many'
import End from './End'

import domain from './domain'

var affected_now = domain.affected.is_now


export default function merge (...buds)
{
	var bud1 = buds[0]

	var value = pick(buds, true)
	var next  = bud1.constructor(value)

	if (value !== End)
	{
		/* compute function: */
		var compute = Pick(buds)

		/* collect direct & reverse deps: */
		domain.deps.register(next, buds, compute)
	}

	return next
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

	var first = Nothing
	var all = []
	var y1 = 0
	var y2 = 0

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

		y2 = y1
		y1 = 1

		y2 || (first = value)
		y2 && all.push(value)
	}

	switch (y1 + y2)
	{
		case  0: return Nothing
		case  1: return first
		default: return Many(first, ...all)
	}
}
