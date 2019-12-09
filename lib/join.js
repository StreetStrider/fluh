/* eslint complexity: [ 2, 6 ] */

import Nothing from './Nothing'
import End from './End'

import { deps_fns } from './realm'
import { deps_inv } from './realm'
import { queue }   from './realm'


export default function join (...args)
{
	const buds = args.slice(0, -1)
	const fn   = args[args.length - 1]

	const bud1 = buds[0]

	const value = compute_initial(buds, fn)
	const dep   = bud1.constructor(value)

	if (value !== End)
	{
		const inv = []

		for (const bud of buds)
		{
			if (bud.value !== End)
			{
				bud.deps.push(dep)

				inv.push(bud)
			}
		}

		deps_inv.set(dep, inv)
		deps_fns.set(dep, compute(buds, fn))
	}

	return dep
}


function compute (buds, fn)
{
	return () =>
	{
		const args = collect(buds)

		if (! args)
		{
			return Nothing
		}

		return fn(...args)
	}
}

function compute_initial (buds, fn)
{
	const args = collect(buds, true)

	if (! args)
	{
		return Nothing
	}

	return fn(...args)
}


function collect (buds, any_touched = false)
{
	const L    = buds.length
	const args = Array(L)

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
