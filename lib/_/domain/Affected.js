// TODO: try impr shortcut with affected count


export default function Affected ()
{
	var current = 1

	function next ()
	{
		current++
	}

	var aff = new WeakMap

	function affect (bud)
	{
		aff.set(bud, current)
	}

	function is_now (bud)
	{
		/* worse performance: return (! (aff.get(bud) < op_current())) */
		return (aff.get(bud) === current)
	}

	return { next, affect, is_now }
}
