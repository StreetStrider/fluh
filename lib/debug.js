
import { inspect as util_inspect } from 'util'


function inspect (value, options)
{
	return util_inspect(value, { colors: true, depth: 2, ...options })
}


export default function debug (label, options)
{
	if (arguments.length === 1)
	{
		if (typeof label === 'object')
		{
			({ label, ...options } = label)
		}
	}

	return (bud) =>
	{
		return bud.on(value =>
		{
			console.log((label || bud.id), inspect(value, options))
		})
	}
}
