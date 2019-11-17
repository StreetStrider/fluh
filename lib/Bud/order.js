
import { Id } from '../realm'


export default function order_cached (bud)
{
	var tick  = null
	var cache = null

	return () =>
	{
		if (tick !== Id.current())
		{
			tick  = Id.current()
			cache = order(bud)
		}

		return cache
	}
}


function order (bud)
{
	var bare = order_bare(bud)

	var present = new Set
	var total   = []

	walk_deps(bare, present, total)

	return total
}

function order_bare (bud)
{
	return [ bud, bud.deps.map(order_bare) ]
}

function walk_deps (bare, present, total)
{
	var deps = bare[1]

	for (let n = (deps.length - 1); (n >= 0); n--)
	{
		walk(deps[n], present, total)
	}
}

function walk (bare, present, total)
{
	walk_deps(bare, present, total)

	var bud = bare[0]

	if (! present.has(bud))
	{
		present.add(bud)

		total.unshift(bud)
	}
}
