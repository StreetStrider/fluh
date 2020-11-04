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
		// direct: Direct(),
		reverse: Reverse(),

		finalize,
	}

	function finalize (bud)
	{
		/** deps.direct.finalize: */
		const deps = bud.deps

		if (deps.length)
		{
			// TODO: possible clean rev on dependents
			deps.splice(0)
		}
		/***/

		d.reverse.finalize(bud)
	}

	return d
}


function Reverse ()
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
		return rev && rev.deps
	}

	function finalize (bud)
	{
		const rev = W.get(bud)

		if (! rev) { return }

		W.delete(bud)

		const { deps } = rev

		if (! deps.length) { throw new Error('!') }

		const L = deps.length

		for (let n = 0; (n < L); n++)
		{
			const deps_of_rev_dep = deps[n].deps

			if (! deps_of_rev_dep.length) { continue }

			const index = deps_of_rev_dep.indexOf(bud)

			if (~ index)
			{
				deps_of_rev_dep.splice(index, 1)
			}
		}

		/* deps.splice(0) */
	}

	return reverse
}
