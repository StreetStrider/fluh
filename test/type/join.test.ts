
import Bud  from 'fluh/lib/Bud'
import join from 'fluh/lib/join'

function Join1 ()
{
	const a = Bud(1)
	const b = join(a, x =>
	{
		x // $ExpectType number
		return (x + 1)
	})
	const c = join(a, x => String(x))

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

function Join1F ()
{
	const a = Bud(1)
	const b = join(x =>
	{
		x // $ExpectType number
		return (x + 1)
	}
	, a)
	const c = join(x => String(x), a)

	a // $ExpectType Bud<number, number>
	b // $ExpectType Bud<number, number>
	c // $ExpectType Bud<string, string>

	b.on(x =>
	{
		x // $ExpectType number
	})
	c.on(x =>
	{
		x // $ExpectType string
	})
}

function Join2 ()
{
	const a = Bud(1)
	const b = Bud('X')
	const c = join(a, b, (a, b) =>
	{
		a // $ExpectType number
		b // $ExpectType string
		return (String(a) === b)
	})

	a // $ExpectType Bud<number, number>
	b // $ExpectType Bud<string, string>
	c // $ExpectType Bud<boolean, boolean>

	c.on(x =>
	{
		x // $ExpectType boolean
	})
}

function Join2F ()
{
	const a = Bud(1)
	const b = Bud('X')
	const c = join((a, b) =>
	{
		a // $ExpectType number
		b // $ExpectType string
		return (String(a) === b)
	}
	, a, b)

	a // $ExpectType Bud<number, number>
	b // $ExpectType Bud<string, string>
	c // $ExpectType Bud<boolean, boolean>

	c.on(x =>
	{
		x // $ExpectType boolean
	})
}

function Join6 ()
{
	const b1 = Bud(1)
	const b2 = Bud('X')
	const c = join((b1, b2, b3, b4, b5, b6) =>
	{
		b1 // $ExpectType number
		b2 // $ExpectType string
		b3 // $ExpectType number
		b4 // $ExpectType number
		b5 // $ExpectType string
		b6 // $ExpectType number
		return `${ b1 }:${ b2 }:${ b3 }:${ b4 }:${ b5 }:${ b6 }`
	}
	, b1, b2, Bud(3), Bud(4), Bud('Y'), Bud(6))

	c // $ExpectType Bud<string, string>

	c.on(x =>
	{
		x // $ExpectType string
	})
}

function Join6Tuple ()
{
	const b1 = Bud(1)
	const b2 = Bud('X')
	const c = join((b1, b2, b3, b4, b5, b6) =>
	{
		b1 // $ExpectType number
		b2 // $ExpectType string
		b3 // $ExpectType number
		b4 // $ExpectType number
		b5 // $ExpectType string
		b6 // $ExpectType number
		return [ b1, b2, b3, b4, b5, b6 ] as const
	}
	, b1, b2, Bud(3), Bud(4), Bud('Y'), Bud(6))

	c // $ExpectType Bud<readonly [number, string, number, number, string, number], readonly [number, string, number, number, string, number]>

	c.on(x =>
	{
		x // $ExpectType readonly [number, string, number, number, string, number]
	})
}

function Join6Spread ()
{
	const c = join((b1, b2, b3, b4, b5, b6) =>
	{
		b1 // $ExpectType number
		b2 // $ExpectType string
		b3 // $ExpectType number
		b4 // $ExpectType number
		b5 // $ExpectType string
		b6 // $ExpectType number
		return `${ b1 }:${ b2 }:${ b3 }:${ b4 }:${ b5 }:${ b6 }`
	}
	, ...[ Bud(1), Bud('X'), Bud(3), Bud(4), Bud('Y'), Bud(6) ] as const)

	c // $ExpectType Bud<string, string>

	c.on(x =>
	{
		x // $ExpectType string
	})
}
