/* eslint complexity: [ 2, 7 ] */

import Counter from '../Counter'

import { propagate } from './propagate'
import { effects }   from './propagate'
import { finalize }  from './finalize'


export default function Queue ({ Id, deps_fns, deps_inv })
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

			if (finalize(queue, dep))
			{
				been_finalized = true
			}
		}

		if (been_finalized)
		{
			Id.next()
		}
	}

	function compute (bud)
	{
		return deps_fns.get(bud)()
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

	queue.invs_finalize = (bud) =>
	{
		var invs = deps_inv.get(bud)

		if (invs)
		{
			deps_inv.delete(bud)
			deps_fns.delete(bud)
		}

		return invs
	}

	return queue
}
