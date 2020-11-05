
import End from '../End'

import Counter from './Counter'

import propagate_on from './propagate'


export default function Queue (domain)
{
	var hot = false

	var que_que = []

	var Op = Counter()
	var op_current = Op.current
	var op_next = Op.next

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

		var updated = propagate_on(affect, bud, value)

		if (! updated)
		{
			return
		}

		var order = domain.order(bud)
		var L = order.length

		propagate(order, L)
		effects(bud, order, L)
		finalize(bud, order, L)
	}

	function propagate (order, L)
	{
		for (var n = 0; (n < L); n++)
		{
			var dep = order[n]
			var value = domain.deps.reverse.get(dep).compute()

			propagate_on(affect, dep, value)
		}
	}

	function effects (bud, order, L)
	{
		effects_on(bud)

		for (var n = 0; (n < L); n++)
		{
			effects_on(order[n])
		}
	}

	function effects_on (bud)
	{
		if (queue.affected_now(bud))
		{
			bud.on.emit()
		}
	}

	function finalize (bud, order, L)
	{
		var been_finalized = finalize_on(bud)

		for (var n = 0; (n < L); n++)
		{
			if (finalize_on(order[n]))
			{
				been_finalized = true
			}
		}

		if (been_finalized)
		{
			domain.Id.next()
		}
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
