
import End from '../../End'

import Affected from './Affected'
import Computation from './Computation'
import Queue from './Queue'


export default function Domain ()
{
	var domain =
	{
		id: 1,
		deps: Deps(),
		affected: Affected(),
		comp: null,
		queue: null,
		state,
	}

	domain.comp  = Computation(domain)
	domain.queue = Queue(domain)

	function state (bud)
	{
		var direct  = domain.deps.direct.get(bud)
		var reverse = domain.deps.reverse.get_test(bud)
		var order   = domain.comp(bud).order

		return { direct, reverse, order }
	}

	return domain
}


function Deps ()
{
	var d =
	{
		direct: Direct(),
		reverse: null,

		register,
		finalize,
	}

	d.reverse = Reverse(d.direct)

	function register (bud_new, bud_deps, compute)
	{
		var deps = []

		for (var bud of bud_deps)
		{
			if (bud.value !== End)
			{
				d.direct.add(bud, bud_new)

				deps.push(bud)
			}
		}

		d.reverse.add(bud_new, { compute, deps })
	}

	function finalize (bud)
	{
		d.direct.finalize(bud)
		d.reverse.finalize(bud)
	}

	return d
}


function Direct ()
{
	var D = new WeakMap

	var direct =
	{
		add,
		remove,
		get,
		finalize,
	}

	function add (bud, dep)
	{
		get(bud).push(dep)
	}

	function remove (bud, dep)
	{
		var deps = get(bud)
		var index = deps.indexOf(dep)
		if (~ index)
		{
			deps.splice(index, 1)
		}
	}

	function get (bud)
	{
		if (! D.has(bud))
		{
			D.set(bud, [])
		}

		return D.get(bud)
	}

	function finalize (bud)
	{
		D.delete(bud)
	}

	return direct
}


function Reverse (direct)
{
	var W = new WeakMap

	var reverse =
	{
		add,
		get,
		get_test,
		finalize,
	}

	function add (bud, { compute, deps })
	{
		W.set(bud, { compute, deps })
	}

	function get (bud)
	{
		return W.get(bud)
	}

	function get_test (bud)
	{
		var rev = get(bud)
		return (rev && rev.deps)
	}

	function finalize (bud)
	{
		var rev = W.get(bud)

		if (! rev) { return }

		W.delete(bud)

		var deps = rev.deps
		var L = deps.length

		for (var n = 0; (n < L); n++)
		{
			direct.remove(deps[n], bud)
		}

		/* deps.splice(0) */
	}

	return reverse
}
