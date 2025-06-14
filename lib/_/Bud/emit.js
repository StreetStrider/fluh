
import Nothing from '../../Nothing'

import domain from '../domain/index.js'

var queue = domain.queue


export default function (bud)
{
	return function emit (value)
	{
		if (! arguments.length)
		{
			value = Nothing
		}

		queue(bud, value)

		return bud
	}
}
