
import Bud   from 'fluh/lib/Bud'
import merge from 'fluh/lib/merge'

function Merge ()
{
	const a = Bud(1)
	const b = Bud('X')

	const c = merge(a, b)

	c // $ExpectType Bud<string | number, string | number>

	c.on(x =>
	{
		x // $ExpectType string | number
	})
}
