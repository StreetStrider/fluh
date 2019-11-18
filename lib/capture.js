

export default function capture (fn)
{
	return (...args) =>
	{
		try
		{
			return fn(...args)
		}
		catch (e)
		{
			return e
		}
	}
}
