
import order from './order'
import Nothing from './Nothing'


export default function Queue ({ log })
{
	var locks = 0
	var que_que = []

	function queue (bud)
	{
		locks++
		log('    LOCKS+', locks)

		que_que.push([ bud, bud.value ])

		bud.on.emit()

		locks--
		log('    LOCKS-', locks)

		if (! locks)
		{
			process()
		}
		else
		{
			log('    QUE inside que', locks)
		}
	}

	function process ()
	{
		while (que_que.length)
		{
			frame(que_que.shift())
		}
	}

	function frame (next)
	{
		var [ bud, value ] = next

		var marked = new Set

		function touched (bud)
		{
			bud.deps.forEach(dep => marked.add(dep))
		}


		log()
		log('    QUEUE start')

		var que = order(bud)
		touched(bud)

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
			var value = bud.pull()
			if (value !== Nothing)
			{
				touched(bud)
			}
		}

		log('    QUEUE end')
		log()
	}

	return queue
}
