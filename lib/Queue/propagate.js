
import Nothing from '../Nothing'
import Many from '../Many'
import End from '../End'

import { queue } from '../realm'

import { dep_fns } from '../realm'
// import { log } from '../realm'


export default function propagate (bud, value)
{
	if (bud.value === End)
	{
		// log_log('already End', bud)

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
			// log_log('additional', log.inspect(v), 'INTO', bud)

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


/*function log_log (...args)
{
	// log('    PROPAGATE', ...args)
}*/
