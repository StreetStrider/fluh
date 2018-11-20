
import def from 'def-prop'
var { val } = def

export default function Effects ()
{
	var fns = []

	function on (fn)
	{
		fns.push(fn)
	}

	def(on, 'emit', val(function emit (value)
	{
		fns.forEach(fn => fn(value))
	}))

	return on
}
