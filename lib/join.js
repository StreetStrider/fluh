
import Bud from './Bud'
import { Deps } from './realm'

export default function join (buds, fn)
{
	var derv = Bud(() => {})

	buds.forEach(b => Deps(b).push(derv))

	return derv
}


export function order (bud)
{
	var $ = Deps(bud)
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
	var present = new Set

	var R = []
	for (let L = buds.length, n = (L - 1); (n >= 0); n--)
	{
		let next = buds[n]

		if (! present.has(next))
		{
			present.add(next)

			R.unshift(next)
		}
	}

	return R
}
