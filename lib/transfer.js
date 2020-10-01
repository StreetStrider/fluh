
import tap from './tap'


export default function transfer (bud_source, fn)
{
	return bud_source.constructor()
	.thru(tap(bud =>
	{
		bud_source.on(value =>
		{
			fn(value, bud.emit)
		})
	}))
}
