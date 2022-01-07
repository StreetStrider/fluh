
import Bud from 'fluh/lib/Bud'
import Nothing from 'fluh/lib/Nothing'
import Many from 'fluh/lib/Many'
import End from 'fluh/lib/End'

function Map ()
{
	const a = Bud(1)
	const b = a.map(x =>
	{
		x // $ExpectType number
		return (x + 1)
	})
	const c = a.map(x => String(x))

	a // $ExpectType Bud<number, number>
	b // $ExpectType Bud<number, number>
	c // $ExpectType Bud<string, string>

	a.on(x =>
	{
		x // $ExpectType number
	})
	b.on(x =>
	{
		x // $ExpectType number
	})
	c.on(x =>
	{
		x // $ExpectType string
	})
}

function MapNothing ()
{
	const a = Bud<number>()
	const b = a.map(x =>
	{
		x // $ExpectType number
		return (x + 1)
	})
	const c = a.map(x => String(x))

	a // $ExpectType Bud<number, number | typeof Nothing>
	b // $ExpectType Bud<number, number>
	c // $ExpectType Bud<string, string>

	a.on(x =>
	{
		x // $ExpectType number
	})
	b.on(x =>
	{
		x // $ExpectType number
	})
	c.on(x =>
	{
		x // $ExpectType string
	})
}

function MapSpecial ()
{
	const a = Bud(1)
	a // $ExpectType Bud<number, number>

	const b = a.map(x => Nothing)
	const c = a.map(x => Many(1, 2))
	const d = a.map(x => End)

	b // $ExpectType Bud<typeof Nothing, typeof Nothing>
	c // $ExpectType Bud<number, number>
	d // $ExpectType Bud<typeof End, typeof End>

	/* TODO:
	b.on(x =>
	{
		x // $---ExpectType never
	})
	*/
}
