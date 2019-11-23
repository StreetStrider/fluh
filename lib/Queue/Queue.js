
import Counter from '../Counter'

import { propagate } from './propagate'
import { propagate_dependent } from './propagate'


export default function Queue (dep_fns)
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

			propagate_dependent(queue, dep)
		}
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

	queue.compute = (bud) =>
	{
		return dep_fns.get(bud)()
	}

	return queue
}
