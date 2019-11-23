/* eslint complexity: [ 2, 6 ] */

import Nothing from './Nothing'

import { dep_fns } from './realm'
import { queue }   from './realm'


export default function join (...args)
{
	const buds = args.slice(0, -1)
	const fn   = args[args.length - 1]

	const bud1 = buds[0]

	const value = compute_initial(buds, fn)
	const dep   = bud1.constructor(value)

	dep_fns.set(dep, compute(buds, fn))

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

function compute_initial (buds, fn)
{
	var args = collect(buds, true)

	if (! args)
	{
		return Nothing
	}

	return fn(...args)
}


function collect (buds, any_touched = false)
{
	const L = buds.length
	var args = Array(L)

	for (let n = 0; (n < L); n++)
	{
		const bud = buds[n]
		const { value } = bud

		if (value === Nothing)
		{
			return false
		}

		if (! any_touched)
		{
			if (queue.touched_now(bud))
			{
				any_touched = true
			}
		}

		args[n] = value
	}

	if (! any_touched)
	{
		return false
	}

	return args
}
