
import Nothing from '../Nothing'
import End from '../End'

import sequence from './sequence'

import { queue } from '../realm'

import { log } from '../realm'
import inspect from '../Log/inspect'


export default function propagate (bud, value)
{
	if (bud.value === End)
	{
		log_log('already End', bud)

		return false
	}

	value = sequence(value)

	var head = true

	for (let n = 1, L = value.length; (n <= L); n++)
	{
		let v = value[n - 1]

		if (head)
		{
			if (v === Nothing)
			{
				log_log('Nothing', bud)

				continue
			}

			head = false

			log_log(inspect(v), 'INTO', bud)

			bud.value = v
			bud.on.emit()
			queue.touched(bud)
		}
		else
		{
			log_log('additional', inspect(v), 'INTO', bud)

			bud.emit(v)
		}
	}

	return (! head)
}


function log_log (...args)
{
	log('    PROPAGATE', ...args)
}
