
import Bud from './Bud'
import tap from './tap'
import { when_end } from '../map/when'


export default function resource (fn)
{
	return Bud().thru(tap(bud =>
	{
		var disposer = fn(bud.emit, bud)

		bud.on(when_end(disposer))
	}))
}
