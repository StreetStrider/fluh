/* eslint complexity: [ 2, 6 ] */

import Nothing from './Nothing'
import End from './End'

import domain from './domain'


export default function join (...args)
{
	const buds = args.slice(0, -1)
	const fn   = args[args.length - 1]

	const bud1 = buds[0]

	const value = compute_initial(buds, fn)
	const dep   = bud1.constructor(value)

	if (value !== End)
	{
		/* compute function: */
		const compute = Compute(buds, fn)

		/* collect direct & reverse deps: */
		const deps = []

		for (const bud of buds)
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
	const args = collect(buds, true)

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
		const args = collect(buds)

		if (! args)
		{
			return Nothing
		}

		return fn(...args)
	}
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
			if (domain.queue.touched_now(bud))
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
