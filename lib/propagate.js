
import Nothing from './Nothing'

import sequence from './sequence'

import { log } from './realm'
import inspect from './inspect'


export default function propagate (bud, value)
{
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
	log.enabled && log('    PROPAGATE', ...args)
}
