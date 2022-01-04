
import Bud from 'fluh/lib/Bud'

import Nothing from 'fluh/lib/Nothing'
import Many from 'fluh/lib/Many'
import End from 'fluh/lib/End'

import join from 'fluh/lib/join'

import { state } from './Bud.test'


describe('parallel', () =>
{
	it('A → B, A → C', () =>
	{
		var a = Bud().emit(1)

		var b = join(a, a => a * 10)
		var c = join(a, a => a * 100)

		var as = spy()
		a.on(as)

		state(a,
		{
			value: 1,
			deps: [ b, c ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 10,
			rev: [ a ],
		})

		state(c,
		{
			value: 100,
			rev: [ a ],
		})

		expect(as.callCount).eq(1)
	})

	it('A → B,C → D', () =>
	{
		var a = Bud().emit(1)

		var b = join(a, a => a * 10)
		var c = join(a, a => a * 100)

		var d = join(b, c, (b, c) => b + c)

		var as = spy()
		a.on(as)
		var ds = spy()
		d.on(ds)

		state(a,
		{
			value: 1,
			deps: [ b, c ],
			order: [ b, c, d ],
		})

		state(b,
		{
			value: 10,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(c,
		{
			value: 100,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(d,
		{
			value: 110,
			rev: [ b, c ],
		})

		expect(as.callCount).eq(1)
		expect(ds.callCount).eq(1)

		a.emit(2)

		expect(as.callCount).eq(2)
		expect(ds.callCount).eq(2)
	})

	it('A → x3 → B', () =>
	{
		var a = Bud().emit(1)

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

	it('A → B,C → D with Nothing', () =>
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

	it('A → B,C → D Many', () =>
	{
		var a = Bud()

		var b = join(a, a => a)
		var c = join(a, a => a * 100)

		var d = join(b, c, (b, c) => b + c)

		var as = spy()
		a.on(as)
		var ds = spy()
		d.on(ds)

		a.emit(Many(1, 2))

		expect(as.callCount).eq(2)
		expect(ds.callCount).eq(2)

		a.emit(Many(3, 4, 5))
		expect(d.value).eq(505)

		expect(as.callCount).eq(5)
		expect(ds.callCount).eq(5)
	})

	it('A → B(End),C → D', () =>
	{
		var a = Bud()

		var b = join(a, a =>
		{
			if (a === 3)
			{
				return End
			}

			return (a * 10)
		})
		var c = join(a, a => a * 100)

		var d = join(b, c, (b, c) => (b, c))

		var as = spy()
		a.on(as)
		var ds = spy()
		d.on(ds)

		a.emit(1)

		state(a,
		{
			value: 1,
			deps: [ b, c ],
			order: [ b, c, d ],
		})

		state(b,
		{
			value: 10,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(c,
		{
			value: 100,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(d,
		{
			value: 100,
			rev: [ b, c ],
		})

		expect(as.callCount).eq(1)
		expect(ds.callCount).eq(1)

		a.emit(2)

		state(a,
		{
			value: 2,
			deps: [ b, c ],
			order: [ b, c, d ],
		})

		state(b,
		{
			value: 20,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(c,
		{
			value: 200,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(d,
		{
			value: 200,
			rev: [ b, c ],
		})

		expect(as.callCount).eq(2)
		expect(ds.callCount).eq(2)

		a.emit(3)

		state(a,
		{
			value: 3,
			deps: [ c ],
			order: [ c, d ],
		})

		state(b,
		{
			value: End,
		})

		state(c,
		{
			value: 300,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(d,
		{
			value: 300,
			rev: [ b, c ],
		})

		expect(as.callCount).eq(3)
		expect(ds.callCount).eq(3)
	})
})
