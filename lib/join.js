
import Bud from './Bud'
import { Deps } from './realm'


export default function join (buds, fn)
{
	var dependent = Bud(() => {})

	buds.forEach(bud => Deps(bud).push(dependent))

	return dependent
}
