/* eslint max-depth: [ 2, 4 ] */

export default function Queue (domain)
{
	var hot = false
	var que_que = []

	var next = domain.affected.next
	var comp = domain.comp

	function queue (bud, value)
	{
		if (! hot)
		{
			hot = true

			try
			{
				for (;;)
				{
					next()
					comp(bud)(value)

					if (! que_que.length) break

					bud   = que_que[0]
					value = que_que[1]

					que_que.splice(0, 2)
				}
			}
			finally
			{
				hot = false
			}
		}
		else
		{
			que_que.push(bud, value)
		}
	}

	return queue
}
