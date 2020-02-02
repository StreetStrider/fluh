
import Bud from './Bud'
import { when_end } from '../map/when'


export default function resource (fn)
{
	return Bud().thru(bud =>
	{
		var ds = fn(bud.emit, bud)

		bud.on(when_end(ds))

		return bud
	})
}
