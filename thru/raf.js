
var raf = requestAnimationFrame

import tap from '../lib/tap'


export default function defer (bud_source)
{
	return bud_source.constructor()
	.thru(tap(bud_raf =>
	{
		bud_source.on(value =>
		{
			raf(() => bud_raf.emit(value))
		})
	}))
}
