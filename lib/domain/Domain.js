/* eslint complexity: [ 2, 6 ] */

import calc_order from '../order'

import Counter from './Counter'
import Queue from './Queue'


export default function Domain ()
{
	const domain =
	{
		Id: Counter(),
		deps: Deps(),
		order: null,
		queue: null,
	}

	domain.order = Order(domain)
	domain.queue = Queue(domain)

	return domain
}


function Order (domain)
{
	var current = domain.Id.current
	var W = new WeakMap

	return function (bud)
	{
		var tick = current()

		var cache = W.get(bud)

		if (! cache)
		{
			var order = calc_order(bud)
			var newly = { tick, order }
			W.set(bud, newly)
			return order
		}

		if (cache.tick === tick)
		{
			return cache.order
		}

		cache.tick = tick
		var order = cache.order = calc_order(bud)
		return order
	}
}


function Deps ()
{
	var d =
	{
		direct: Direct(),
		reverse: null,

		finalize,
	}

	d.reverse = Reverse(d.direct)

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
		const rev = W.get(bud)

		if (! rev) { return }

		W.delete(bud)

		const deps = rev.deps
		const L = deps.length

		for (let n = 0; (n < L); n++)
		{
			direct.remove(deps[n], bud)
		}

		/* deps.splice(0) */
	}

	return reverse
}
