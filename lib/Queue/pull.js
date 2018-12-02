
import propagate from './propagate'


export default function pull (bud)
{
	var efn   = bud.efn
	var value = efn(bud)

	return propagate(bud, value)
}
