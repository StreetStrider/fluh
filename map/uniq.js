
import Nothing from '../lib/Nothing'


export default function uniq ()
{
	var recent = Nothing

	return (value) =>
	{
		if (value === recent) { return Nothing }

		recent = value

		return value
	}
}
