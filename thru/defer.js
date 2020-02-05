
import tap  from '../lib/tap'
import asap from '../lib/asap'


export default function defer (bud_source)
{
	return bud_source.constructor()
	.thru(tap(bud_deferred =>
	{
		bud_source.on(value =>
		{
			asap(() => bud_deferred.emit(value))
		})
	}))
}
