
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

	return log
}
