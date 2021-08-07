/* eslint complexity: [ 2, 7 ] */

import End from '../End'

import Order from '../order'

import Affected from './Affected'
import Queue from './Queue'
import propagate from './propagate'


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


function Computation (domain)
{
	var W = new WeakMap

	var deps_reverse_get = domain.deps.reverse.get
	var affect = domain.affected.affect
	var affected_now = domain.affected.is_now

	return function comp (bud)
	{
		var tick  = domain.id
		var frame = W.get(bud)

		if (frame && frame.tick === tick)
		{
			return frame
		}

		var order = Order(bud, domain)
		var frame = Frame(bud, order)
		frame.tick = tick
		frame.order = order

		W.set(bud, frame)
		return frame
	}

	function Frame (bud, order)
	{
		var L = order.length

		switch (L)
		{
		case 0:
			return function frame (value)
			{
				if (! propagate(affect, bud, value)) { return }

				bud.on.emit()

				var been_finalized = finalize(bud)
				if (been_finalized)
				{
					domain.id++
				}
			}

		case 1:
			var order_only = order[0]
			var compute_only = deps_reverse_get(order_only).compute

			return function frame (value)
			{
				if (! propagate(affect, bud, value)) { return }

				value = compute_only()
				propagate(affect, order_only, value)

				bud.on.emit()
				effects(order_only)

				var been_finalized = finalize(bud)
				var been_finalized = (finalize(order_only) || been_finalized)

				if (been_finalized)
				{
					domain.id++
				}
			}

		default:
			var computes = order.map(bud => deps_reverse_get(bud).compute)

			return function frame (value)
			{
				if (! propagate(affect, bud, value)) { return }

				for (var n = 0; (n < L); n++)
				{
					var dep = order[n]
					value = computes[n]()

					propagate(affect, dep, value)
				}

				bud.on.emit()
				for (var n = 0; (n < L); n++)
				{
					effects(order[n])
				}

				var been_finalized = finalize(bud)
				for (var n = 0; (n < L); n++)
				{
					been_finalized = (finalize(order[n]) || been_finalized)
				}

				if (been_finalized)
				{
					domain.id++
				}
			}
		}
	}

	function effects (bud)
	{
		if (affected_now(bud))
		{
			bud.on.emit()
		}
	}

	function finalize (bud)
	{
		if (bud.value !== End) { return false }

		domain.deps.finalize(bud)
		return true
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
