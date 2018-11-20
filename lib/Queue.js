
import order from './order'
import Nothing from './Nothing'


export default function Queue ({ log })
{
	var hot = false
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
			log('    QUEUE inside queue')
		}
	}

	function process ()
	{
		try
		{
			hot = true

			while (que_que.length)
			{
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

		var marked = new Set

		function touched (bud)
		{
			bud.deps.forEach(dep => marked.add(dep))
		}


		log()
		log('    QUEUE start')

		bud.value = value
		bud.on.emit()

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
			let value = bud.pull()
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