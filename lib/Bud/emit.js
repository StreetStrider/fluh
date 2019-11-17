
import Nothing from '../Nothing'
import { queue } from '../realm'


export default function (bud)
{
	return (value = Nothing) =>
	{
		return emit(bud, value)
	}
}


function emit (bud, value)
{
	queue(bud, value)

	return bud
}
