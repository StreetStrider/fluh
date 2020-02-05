
import tap from '../lib/tap'


export default function delay (ms = 0)
{
	return (bud_source) =>
	{
		return bud_source.constructor()
		.thru(tap(bud_delayed =>
		{
			bud_source.on(value =>
			{
				setTimeout(() =>
				{
					bud_delayed.emit(value)
				}
				, ms)
			})
		}))
	}
}
