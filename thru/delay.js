

export default function delay (ms = 0)
{
	return (bud) =>
	{
		var delayed = bud.constructor()

		bud.on(value =>
		{
			setTimeout(() =>
			{
				delayed.emit(value)
			}
			, ms)
		})

		return delayed
	}
}
