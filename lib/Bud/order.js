
import { Current } from '../realm'

// import { log } from '../realm'


export default function order_cached (bud)
{
	var cache = null

	return () =>
	{
		if (! cache)
		{
			// log_cache('init FOR', bud)

			return refresh()
		}
		else if (cache[0] < Current())
		{
			// log_cache('update FOR', bud, 'FROM', cache[0], 'TO', Current())

			return refresh()
		}
		else
		{
			// log_cache('hit', bud)

			return cache[1]
		}
	}

	function refresh ()
	{
		// eslint-disable-next-line no-return-assign
		return (cache = [ Current(), order(bud) ], cache[1])
	}
}


function order (bud)
{
	var bare = order_bare(bud)

	var present = Object.create(null)
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

	if (! (bud.id in present))
	{
		present[bud.id] = true

		total.unshift(bud)
	}
}


/*function log_cache (...args)
{
	// log('    CACHE', ...args)
}*/
