/*
  this thing is stateful,
  shall be rewritten in incapsulated manner:

  var R = Realm()
  R.Bud()…
*/


import Log from './log'

export var log = Log()


var deps = new WeakMap

export function Deps (b)
{
	if (! (deps.has(b)))
	{
		deps.set(b, [])
	}

	return deps.get(b)
}


var next = 1

export function Next ()
{
	return `B/${ next++ }`
}


var updates = new Set

export function update (bud)
{
	Deps(bud).forEach(bud => updates.add(bud))
}


var que = []

export function queue (buds)
{
	var was_empty = (! que.length)

	que = que.concat(buds)

	if (was_empty)
	{
		log('queue !')

		while (que.length)
		{
			let bud = que.shift()

			if (! updates.has(bud))
			{
				log('-', bud)

				continue
			}

			log('~', bud)

			updates.delete(bud)
			bud.pull()
		}

		log('queue []')
	}
	else
	{
		log('queue +')
	}
}
