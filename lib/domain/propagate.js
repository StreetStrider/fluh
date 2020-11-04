
import Nothing from '../Nothing'
import Many from '../Many'
import End from '../End'


export default function propagate (queue, bud, value)
{
	if (bud.value === End)
	{
		return false
	}

	if (! Many.is(value))
	{
		return propagate_first(queue, bud, value)
	}


	const L = value.length
	let been_updated = false

	for (let n = 0; (n < L); n++)
	{
		const value_next = value[n]

		if (! been_updated)
		{
			been_updated = propagate_first(queue, bud, value_next)
		}
		else
		{
			propagate_following(bud, value_next)
		}
	}

	return been_updated
}

function propagate_first (queue, bud, value)
{
	if (value === Nothing)
	{
		return false
	}

	bud.value = value

	/* bud.on.emit() */

	queue.touch(bud)

	return true
}

function propagate_following (bud, value)
{
	bud.emit(value)
}
