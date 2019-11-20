
import asap from '../lib/asap'


export default function defer (bud)
{
	var deferred = bud.constructor()

	bud.on(value =>
	{
		asap(() => deferred.emit(value))
	})

	return deferred
}
