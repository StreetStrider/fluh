
export default Log('')

function Log (prefix)
{
	prefix = [].concat(prefix)

	function log (...args)
	{
		console.log(prefix.join('/'), ...args)
	}

	log.sub = function sublog (subprefix)
	{
		return Log(prefix.concat(subprefix))
	}

	return log
}
