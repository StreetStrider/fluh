
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

			refresh()
		}
		else if (cache[0] < Current())
		{
			// log_cache('update FOR', bud, 'FROM', cache[0], 'TO', Current())

			refresh()
		}
		/*else
		{
			// log_cache('hit', bud)
		}*/

		return cache[1].slice()
	}

	function refresh ()
	{
		cache = [ Current(), order(bud) ]
	}
}


function order (bud)
{
	var $ = bud.deps
	$ = $.map(dep => [ dep, ...order(dep) ])
	$ = cat($)
	$ = uniq($)
	return $
}


var concat = [].concat

function cat (seq)
{
	return concat.apply([], seq)
}


function uniq (buds)
{
	var R = []

	var present = new Set
	for (let L = buds.length, n = L; n; n--)
	{
		let next = buds[n - 1]

		if (! present.has(next))
		{
			present.add(next)

			R.unshift(next)
		}
	}

	return R
}


/*function log_cache (...args)
{
	// log('    CACHE', ...args)
}*/
