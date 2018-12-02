
import Many from '../Many'

export default function sequence (value)
{
	if (Many.is(value))
	{
		return value
	}
	else
	{
		return [ value ]
	}
}
