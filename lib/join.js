/* eslint complexity: [ 2, 9 ] */

import Nothing from './Nothing'
import End from './End'

import domain from './_/domain/index.js'

var affected_now = domain.affected.is_now


export default function join (...args)
{
	if (typeof args[0] === 'function')
	{
		var buds = args.slice(1)
		var fn   = args[0]
	}
	else
	{
		var buds = args.slice(0, -1)
		var fn   = args[args.length - 1]
	}

	var value = collect(buds, fn, true)
	var next  = buds[0].constructor(value)

	if (value !== End)
	{
		/* compute function: */
		var compute = Collect(buds, fn)

		/* collect direct & reverse deps: */
		domain.deps.register(next, buds, compute)
	}

	return next
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
