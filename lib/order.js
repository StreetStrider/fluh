// TODO: optimizable in non-recursive cycle analogue


export default function order (bud, domain)
{
	var bare = order_bare(bud, domain)

	var present = new Set
	var total   = []

	walk_deps(bare, present, total)

	return total
}

function order_bare (bud, domain)
{
	return [ bud, domain.deps.direct.get(bud).map(bud => order_bare(bud, domain)) ]
}

function walk_deps (bare, present, total)
{
	var deps = bare[1]

	for (var n = (deps.length - 1); (n >= 0); n--)
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
