
import tap from './tap'
import { when_end } from '../map/when'


export default function transfer (bud_source, fn)
{
	return bud_source.constructor()
	.thru(tap(bud =>
	{
		var ds = bud_source.on(value =>
		{
			fn(value, bud.emit)
		})

		bud.on(when_end(ds))
	}))
}
