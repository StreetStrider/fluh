/* eslint-disable curly */
/* eslint complexity: [ 2, 7 ] */

import End from '../End'

import Counter from '../Counter'

import propagate_on from './propagate'


export default function Queue (domain)
{
	var hot = false

	var que_que = []

	var Op = Counter()
	var op_current = Op.current
	var op_next = Op.next

	var deps_reverse_get = domain.deps.reverse.get

	var aff = new WeakMap


	function queue (bud, value)
	{
		que_que.push([ bud, value ])

		if (! hot)
		{
			process()
		}
	}

	function process ()
	{
		try
		{
			hot = true

			while (que_que.length)
			{
				op_next()

				frame(que_que.shift())
			}
		}
		finally
		{
			hot = false
		}
	}

	function frame (next)
	{
		var [ bud, value ] = next

		if (! propagate_on(affect, bud, value)) { return }

		var order = domain.order(bud)
		var L = order.length
		var order_first = order[0]

		L && propagate(L, order_first, order)

		bud.on.emit()
		L && effects(L, order_first, order)

		var been_finalized = finalize_on(bud)
		var been_finalized = ((!! L) && finalize(L, order_first, order) || been_finalized)

		if (been_finalized)
		{
			domain.Id.next()
		}
	}

	function propagate (L, order_first, order)
	{
		if (L === 1)
		{
			var value = deps_reverse_get(order_first).compute()

			propagate_on(affect, order_first, value)
		}
		else for (var n = 0; (n < L); n++)
		{
			var dep = order[n]
			var value = deps_reverse_get(dep).compute()

			propagate_on(affect, dep, value)
		}
	}

	function effects (L, order_first, order)
	{
		if (L === 1)
		{
			effects_on(order_first)
		}
		else for (var n = 0; (n < L); n++)
		{
			effects_on(order[n])
		}
	}

	function effects_on (bud)
	{
		if (affected_now(bud))
		{
			bud.on.emit()
		}
	}

	function finalize (L, order_first, order)
	{
		var been_finalized = false

		if (L === 1)
		{
			been_finalized = finalize_on(order_first)
		}
		else for (var n = 0; (n < L); n++)
		{
			been_finalized = (finalize_on(order[n]) || been_finalized)
		}

		return been_finalized
	}

	function finalize_on (bud)
	{
		if (bud.value !== End) { return false }

		domain.deps.finalize(bud)
		return true
	}

	function affect (bud)
	{
		aff.set(bud, op_current())
	}

	function affected_now (bud)
	{
		/* return (! (aff.get(bud) < op_current())) */
		return (aff.get(bud) === op_current())
	}

	queue.affected_now = affected_now

	return queue
}
