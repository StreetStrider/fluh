
import drain from './drain'


export default function concat (bud)
{
	var buffer = []

	bud.on(value => buffer.push(value))

	return drain(bud).then(() => buffer)
}
