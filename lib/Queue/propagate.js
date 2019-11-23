
import Nothing from '../Nothing'
import Many from '../Many'
import End from '../End'

import { dep_fns } from '../realm'


export default function propagate (queue, bud, value)
{
	if (bud.value === End)
	{
		return false
	}

	if (! Many.is(value))
	{
		return update_first(queue, bud, value)
	}


	var updated = false
	const L = value.length

	for (let n = 0; (n < L); n++)
	{
		if (! updated)
		{
			updated = update_first(queue, bud, value[n])
		}
		else
		{
			bud.emit(value[n])
		}
	}

	return updated
}

function update_first (queue, bud, value)
{
	if (value === Nothing)
	{
		return false
	}

	bud.value = value

	bud.on.emit()

	queue.touch(bud)

	return true
}

export function propagate_dependent (queue, bud)
{
	const compute = dep_fns.get(bud)
	const value   = compute()

	return propagate(queue, bud, value)
}
