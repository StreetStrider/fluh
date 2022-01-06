
import inspect from './inspect'


export default function (bud)
{
	return function debug (label, options)
	{
		if (arguments.length === 1)
		{
			if (typeof label === 'object')
			{
				({ label, ...options } = label)
			}
		}

		return bud.on(value =>
		{
			console.log((label || bud.id), inspect(value, options))
		})
	}
}
