
import { inspect as util_inspect } from 'util'


export default function inspect (value, options)
{
	return util_inspect(value, { colors: true, depth: 2, ...options })
}
