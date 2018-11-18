/*
  this thing is stateful,
  shall be rewritten in incapsulated manner:

  var R = Realm()
  R.Bud()…
*/


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
		console.log('queue: start')

		while (que.length)
		{
			let bud = que.shift()

			console.log('~', bud)

			if (! updates.has(bud)) { continue }


			updates.delete(bud)

			bud.evaluate()
			console.log('*', bud)
		}
	}
}
