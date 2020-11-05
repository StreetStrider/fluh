/* eslint complexity: [ 2, 6 ] */

import Counter from './Counter'
import Queue from './Queue'


export default function Domain ()
{
	const domain =
	{
		Id: Counter(),
		deps: Deps(),
		queue: null,
	}

	domain.queue = Queue(domain)

	return domain
}


function Deps ()
{
	var d =
	{
		direct: Direct(),
		reverse: null,

		finalize,
	}

	d.reverse = Reverse(d)

	function finalize (bud)
	{
		d.direct.finalize(bud)
		d.reverse.finalize(bud)
	}

	return d
}


function Direct ()
{
	var D = new WeakMap

	var direct =
	{
		add,
		remove,
		get,
		finalize,
	}

	function add (bud, dep)
	{
		get(bud).push(dep)
	}

	function remove (bud, dep)
	{
		var deps = get(bud)
		var index = deps.indexOf(dep)
		if (~ index)
		{
			deps.splice(index, 1)
		}
	}

	function get (bud)
	{
		if (! D.has(bud))
		{
			D.set(bud, [])
		}

		return D.get(bud)
	}

	function finalize (bud)
	{
		D.delete(bud)
	}

	return direct
}


function Reverse (d)
{
	var W = new WeakMap

	var reverse =
	{
		add,
		get,
		get_test,
		finalize,
	}

	function add (bud, { compute, deps })
	{
		W.set(bud, { compute, deps })
	}

	function get (bud)
	{
		return W.get(bud)
	}

	function get_test (bud)
	{
		var rev = get(bud)
		return (rev && rev.deps)
	}

	function finalize (bud)
	{
		const rev = W.get(bud)

		if (! rev) { return }

		W.delete(bud)

		const deps = rev.deps
		const L = deps.length

		for (let n = 0; (n < L); n++)
		{
			d.direct.remove(deps[n], bud)
		}

		/* deps.splice(0) */
	}

	return reverse
}
