
import pull from './pull'
import propagate from './propagate'


export default function Queue ({ log })
{
	var hot = false
	var marked = null
	var que_que = []

	function queue (bud, value)
	{
		que_que.push([ bud, value ])

		if (! hot)
		{
			process()
		}
		else
		{
			log('    QUEUE already inside queue')
		}
	}

	function process ()
	{
		try
		{
			hot = true

			while (que_que.length)
			{
				marked = new Set

				frame(que_que.shift())
			}
		}
		finally
		{
			hot = false
			marked = null
		}
	}

	function frame (next)
	{
		var [ bud, value ] = next

		log()
		log('    QUEUE start')

		var changed = propagate(bud, value)
		if (! changed)
		{
			return
		}

		var que = bud.order
		while (que.length)
		{
			let bud = que.shift()

			if (! marked.has(bud))
			{
				log('    QUEUE skip', bud)

				continue
			}

			log('    QUEUE *', bud)

			marked.delete(bud)

			pull(bud)
		}

		log('    QUEUE end')
		log()
	}

	function touched (bud)
	{
		bud.deps.forEach(dep => marked.add(dep))
	}

	queue.touched = touched

	return queue
}
