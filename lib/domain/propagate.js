/* eslint-disable complexity */

import Nothing from '../Nothing'
import Many from '../Many'
import End from '../End'


export default function propagate (affect, bud, value)
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
		// return propagate_first(affect, bud, value)

		bud.value = value

		affect(bud)

		return true
	}

	var L = value.length
	var been_updated = false

	for (var n = 0; (n < L); n++)
	{
		var value_next = value[n]

		if (! been_updated)
		{
			// inline:
			// been_updated = propagate_first(affect, bud, value_next)

			if (value_next === Nothing)
			{
				continue
			}

			been_updated = true

			bud.value = value_next

			affect(bud)
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
function propagate_first (affect, bud, value)
{
	if (value === Nothing)
	{
		return false
	}

	bud.value = value

	affect(bud)

	return true
}
*/

/*
function propagate_following (bud, value)
{
	bud.emit(value)
}
*/
