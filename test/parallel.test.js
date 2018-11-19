
import Bud from 'lib/Bud'
import join from 'lib/join'
import Nothing from 'lib/Nothing'

import { expect_bud } from './Bud.test'

describe('parallel', () =>
{
	it('A → B, A → C', () =>
	{
		var a = Bud(() => 1)

		var b = join(a, a => a * 10)
		var c = join(a, a => a * 100)

		expect_bud(b)
		expect_bud(c)

		expect(b.value).eq(10)
		expect(c.value).eq(100)
	})

	it('A → B,C → D', () =>
	{
		var a = Bud(() => 1)

		var b = join(a, a => a * 10)
		var c = join(a, a => a * 100)

		var d = join(b, c, (b, c) => b + c)

		expect_bud(d)

		expect(d.value).eq(110)
	})

	it('A → x3 → B', () =>
	{
		var a = Bud(() => 1)

		var x = [0, 1, 2, 3].map(pow)
		var b = join(...x, sum)

		expect(b.value).eq(1111)

		function pow (n)
		{
			return join(a, a => a * 10 ** n)
		}
		function sum (...args)
		{
			return args.reduce((x, y) => x + y, 0)
		}
	})

	it('A → B,C → D with skips', () =>
	{
		var a = Bud()

		var b = join(a, a => (a % 2) && Nothing || (a / 2))
		var c = join(a, a => a * 100)

		var d = join(b, c, (b, c) => b + c)

		a.emit(1)
		expect(d.value).eq(Nothing)

		a.emit(2)
		expect(d.value).eq(201)
	})
})
