
import inspect from './inspect'


export default function Log ()
{
	function log (...args)
	{
		if (log.enabled)
		{
			console.log(...args)
		}
	}

	log.enabled = false

	log.inspect = function (value)
	{
		if (log.enabled)
		{
			return inspect(value)
		}
	}

	return log
}
