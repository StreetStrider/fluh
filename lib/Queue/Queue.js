/* eslint complexity: [ 2, 7 ] */

import Counter from '../Counter'

import { propagate } from './propagate'
import { effects }   from './propagate'
import { finalize }  from './propagate'


export default function Queue ({ Id, dep_fns, dep_inv })
{
	var hot     = false
	var que_que = []

	var op_num  = Counter()

	var touched = new WeakMap


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

		const updated = propagate(queue, bud, value)

		if (! updated)
		{
			return
		}

		const { order } = bud
		const L = order.length

		for (let n = 0; (n < L); n++)
		{
			const dep = order[n]

			propagate(queue, dep, compute(dep))
		}


		effects(queue, bud)

		for (let n = 0; (n < L); n++)
		{
			const dep = order[n]

			effects(queue, dep)
		}


		let been_finalized = finalize(queue, bud)

		for (let n = 0; (n < L); n++)
		{
			const dep = order[n]

			been_finalized = (been_finalized || finalize(queue, dep))
		}

		if (been_finalized)
		{
			Id.next()
		}
	}

	function compute (bud)
	{
		return dep_fns.get(bud)()
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

	queue.invs = (bud) =>
	{
		return dep_inv.get(bud)
	}

	queue.invs_finalize = (bud) =>
	{
		dep_inv.delete(bud)
	}

	return queue
}
