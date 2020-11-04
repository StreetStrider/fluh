
import Nothing from '../Nothing'

import domain  from '../domain'


export default function (bud)
{
	return function emit (value)
	{
		if (! arguments.length)
		{
			value = Nothing
		}

		domain.queue(bud, value)

		return bud
	}
}
