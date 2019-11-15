
import Counter from '../Counter'

import propagate from './propagate'
import { propagate_dependent } from './propagate'


export default function Queue (/*{ log }*/)
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
		var [ bud, value ] = next

		var updated = propagate(bud, value)
		if (! updated)
		{
			return
		}

		const { order } = bud

		for (let n = 0, L = order.length; (n < L); n++)
		{
			const dep = order[n]

			propagate_dependent(dep)
		}
	}

	queue.touch = (bud) =>
	{
		touched.set(bud, op_num.current())
	}

	queue.touched_now = (bud) =>
	{
		return (! (touched.get(bud) < op_num.current()))
	}

	return queue
}
