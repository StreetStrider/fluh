
import Counter from './Counter'
import Queue from './Queue/Queue'


export default Domain()

export function Domain ()
{
	const domain =
	{
		Id: null,
		queue: null,

		bud_own: null,
		bud_reverse: null,

		reverse,
		reverse_finalize,
	}

	domain.Id = Counter()
	domain.queue = Queue(domain)
	// domain.bud_own = new WeakMap
	domain.bud_reverse = new WeakMap

	function reverse (bud, { compute, deps_reverse })
	{
		domain.bud_reverse.set(bud, { compute, deps_reverse })
	}

	function reverse_finalize (bud)
	{
		var rev = domain.bud_reverse.get(bud)

		domain.bud_reverse.delete(bud)

		return (rev && rev.deps_reverse)
	}

	return domain
}
