
import Nothing from '../Nothing'
import { queue } from '../realm'


export default function (bud)
{
	return function (value)
	{
		if (! arguments.length)
		{
			value = Nothing
		}

		return emit(bud, value)
	}
}


function emit (bud, value)
{
	queue(bud, value)

	return bud
}
