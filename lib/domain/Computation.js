/* eslint complexity: [ 2, 8 ] */

import End from '../End'
import Order from '../order'

import propagate from './propagate'


export default function Computation (domain)
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

				bud.on.present && bud.on.emit()

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

				bud.on.present && bud.on.emit()
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

				bud.on.present && bud.on.emit()
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
			bud.on.present && bud.on.emit()
		}
	}

	function finalize (bud)
	{
		if (bud.value !== End) { return false }

		domain.deps.finalize(bud)
		return true
	}
}
