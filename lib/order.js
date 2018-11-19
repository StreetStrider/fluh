
export default function order (bud)
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
