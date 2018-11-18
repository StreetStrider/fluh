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
