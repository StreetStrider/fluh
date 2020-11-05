/* eslint-disable complexity */

import Nothing from '../Nothing'
import Many from '../Many'
import End from '../End'


export default function propagate (queue, bud, value)
{
	if (bud.value === End)
	{
		return false
	}

	if (value === Nothing)
	{
		return false
	}

	if (! Many.is(value))
	{
		// inline:
		// return propagate_first(queue, bud, value)

		bud.value = value

		queue.touch(bud)

		return true
	}

	const L = value.length
	let been_updated = false

	for (let n = 0; (n < L); n++)
	{
		const value_next = value[n]

		if (! been_updated)
		{
			// inline:
			// been_updated = propagate_first(queue, bud, value_next)

			if (value_next === Nothing)
			{
				continue
			}

			been_updated = true

			bud.value = value_next

			queue.touch(bud)
		}
		else
		{
			// inline:
			// propagate_following(bud, value_next)

			bud.emit(value_next)
		}
	}

	return been_updated
}

/*
function propagate_first (queue, bud, value)
{
	if (value === Nothing)
	{
		return false
	}

	bud.value = value

	queue.touch(bud)

	return true
}
*/

/*
function propagate_following (bud, value)
{
	bud.emit(value)
}
*/
