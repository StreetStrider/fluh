
import Nothing from '../Nothing'
import Many from '../Many'
import End from '../End'


export function propagate (queue, bud, value)
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

	/* bud.on.emit() */

	queue.touch(bud)

	return true
}


export function effects (queue, bud)
{
	if (queue.touched_now(bud))
	{
		bud.on.emit()
	}
}
