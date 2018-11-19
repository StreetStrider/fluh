
import { inspect } from 'util'

export default function (value)
{
	return inspect(value, { colors: true, depth: 2 })
}
