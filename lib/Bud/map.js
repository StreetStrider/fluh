
import join from '../join'

export default function (bud)
{
	return (fn) => join(bud, fn)
}
