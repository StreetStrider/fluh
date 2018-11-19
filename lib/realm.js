/*
  this thing is stateful,
  shall be rewritten in incapsulated manner:

  var R = Realm()
  R.Bud()…
*/


import Log from './log'

export var log = Log()


var next = 1

export function Next ()
{
	return `#${ next++ }`
}


var updates = new Set

export function update (bud)
{
	bud.deps.forEach(dep => updates.add(dep))
}


var que = []

export function queue (buds)
{
	var was_empty = (! que.length)

	que = que.concat(buds)

	if (was_empty)
	{
		log()
		log('    QUEUE start')

		while (que.length)
		{
			let bud = que.shift()

			if (! updates.has(bud))
			{
				log('    QUEUE skip', bud)

				continue
			}

			log('    QUEUE *', bud)

			updates.delete(bud)
			bud.pull()
		}

		log('    QUEUE end')
		log()
	}
	else
	{
		log('    QUEUE append')
	}
}
