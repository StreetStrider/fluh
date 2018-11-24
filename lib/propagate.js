
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
				log.enabled && log('    PROPAGATE Nothing', bud)

				continue
			}

			head = false

			log.enabled && log('    PROPAGATE', inspect(v), 'INTO', bud)

			bud.value = v
			bud.on.emit()
		}
		else
		{
			log.enabled && log('    PROPAGATE additional', inspect(v), 'INTO', bud)

			bud.emit(v)
		}
	}

	return (! head)
}
