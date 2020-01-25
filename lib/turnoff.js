
import { when_end }  from '../map/when'


export default function turnoff (bud, bud_target)
{
	return bud.on(when_end(bud_target.emit))
}
