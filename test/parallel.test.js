
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

		var as = spy()
		a.on(as)

		expect_bud(b)
		expect_bud(c)

		expect(b.value).eq(10)
		expect(c.value).eq(100)

		expect(as.callCount).eq(1)
	})

	it('A → B,C → D', () =>
	{
		var a = Bud(() => 1)

		var b = join(a, a => a * 10)
		var c = join(a, a => a * 100)

		var d = join(b, c, (b, c) => b + c)

		expect_bud(d)

		var as = spy()
		a.on(as)
		var ds = spy()
		d.on(ds)

		expect(d.value).eq(110)

		expect(as.callCount).eq(1)
		expect(ds.callCount).eq(1)

		a.emit(2)

		expect(as.callCount).eq(2)
		expect(ds.callCount).eq(2)
	})

	it('A → x3 → B', () =>
	{
		var a = Bud(() => 1)

		var x = [0, 1, 2, 3].map(pow)
		var b = join(...x, sum)

		expect(b.value).eq(1111)

		var as = spy()
		a.on(as)
		var bs = spy()
		b.on(bs)

		expect(as.callCount).eq(1)
		expect(bs.callCount).eq(1)

		a.emit(2)

		expect(as.callCount).eq(2)
		expect(bs.callCount).eq(2)

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

		var as = spy()
		a.on(as)
		var ds = spy()
		d.on(ds)

		a.emit(1)
		expect(d.value).eq(Nothing)

		expect(as.callCount).eq(1)
		expect(ds.callCount).eq(0)

		a.emit(2)
		expect(d.value).eq(201)

		expect(as.callCount).eq(2)
		expect(ds.callCount).eq(1)
	})
})
