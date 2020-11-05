
import End from '../End'

import Counter from './Counter'

import propagate_on from './propagate'


export default function Queue (domain)
{
	let hot = false

	const que_que = []
	const op_num  = Counter()
	const touched = new WeakMap


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
				op_num.next()

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
		const [ bud, value ] = next

		const updated = propagate_on(queue, bud, value)

		if (! updated)
		{
			return
		}

		const order = domain.order(bud)
		const L = order.length

		propagate(order, L)
		effects(bud, order, L)
		finalize(bud, order, L)
	}

	function propagate (order, L)
	{
		for (let n = 0; (n < L); n++)
		{
			const dep = order[n]
			const value = domain.deps.reverse.get(dep).compute()

			propagate_on(queue, dep, value)
		}
	}

	function effects (bud, order, L)
	{
		effects_on(bud)

		for (let n = 0; (n < L); n++)
		{
			effects_on(order[n])
		}
	}

	function effects_on (bud)
	{
		if (queue.touched_now(bud))
		{
			bud.on.emit()
		}
	}

	function finalize (bud, order, L)
	{
		let been_finalized = finalize_on(bud)

		for (let n = 0; (n < L); n++)
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

	queue.touch = (bud) =>
	{
		touched.set(bud, op_num.current())
	}

	queue.touched_now = (bud) =>
	{
		/* return (! (touched.get(bud) < op_num.current())) */
		return (touched.get(bud) === op_num.current())
	}

	return queue
}
