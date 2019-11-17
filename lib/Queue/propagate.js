
import Nothing from '../Nothing'
import Many from '../Many'
import End from '../End'

import { queue } from '../realm'

import { dep_fns } from '../realm'


export default function propagate (bud, value)
{
	if (bud.value === End)
	{
		return false
	}

	if (! Many.is(value))
	{
		return update_first(bud, value)
	}


	var updated = false
	const L = value.length

	for (let n = 0; (n < L); n++)
	{
		if (! updated)
		{
			updated = update_first(bud, value[n])
		}
		else
		{
			bud.emit(value[n])
		}
	}

	return updated
}

function update_first (bud, value)
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

export function propagate_dependent (bud)
{
	const compute = dep_fns.get(bud)
	const value   = compute()

	return propagate(bud, value)
}
