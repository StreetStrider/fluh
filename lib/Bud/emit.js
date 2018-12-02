
import Nothing from '../Nothing'
import { queue } from '../realm'

import { log } from '../realm'


export default function (bud)
{
	return (value = Nothing) =>
	{
		return emit(bud, value)
	}
}


function emit (bud, value)
{
	log('    EMIT', log.inspect(value), 'FROM', bud)

	queue(bud, value)

	return bud
}
