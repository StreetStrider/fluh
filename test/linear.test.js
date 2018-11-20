
import Bud from 'lib/Bud'
import join from 'lib/join'
import Nothing from 'lib/Nothing'

import { expect_bud } from './Bud.test'

describe('linear', () =>
{
	it('A → B', () =>
	{
		var a = Bud()

		var b = join(a, a => a + 1)

		expect_bud(b)

		var as1 = spy()
		var bs1 = spy()
		a.on(as1)
		a.on(bs1)

		expect(a.value).eq(Nothing)
		expect(b.value).eq(Nothing)

		expect(as1.called).false
		expect(bs1.called).false

		a.emit(1)

		var as2 = spy()
		var bs2 = spy()
		a.on(as2)
		a.on(bs2)

		expect(a.value).eq(1)
		expect(b.value).eq(2)

		expect(as2.callCount).eq(1)
		expect(as2.callCount).eq(1)
	})

	it('A(v) → B', () =>
	{
		var a = Bud(() => 1)

		var b = join(a, a => a + 1)

		var as1 = spy()
		var bs1 = spy()
		a.on(as1)
		a.on(bs1)

		expect(a.value).eq(1)
		expect(b.value).eq(2)
		expect(as1.called).true
		expect(bs1.called).true

		a.emit(1)

		expect(as1.callCount).eq(2)
		expect(bs1.callCount).eq(2)
	})

	it('A → B → C', () =>
	{
		var a = Bud()

		var b = join(a, a => a + 1)
		var c = join(b, b => b * 100)

		expect_bud(b)
		expect_bud(c)

		expect(a.value).eq(Nothing)
		expect(b.value).eq(Nothing)
		expect(c.value).eq(Nothing)

		a.emit(1)

		expect(a.value).eq(1)
		expect(b.value).eq(2)
		expect(c.value).eq(200)
	})

	it('A(v) → B → C', () =>
	{
		var a = Bud(() => 1)

		var b = join(a, a => a + 1)
		var c = join(b, b => b * 100)

		expect(a.value).eq(1)
		expect(b.value).eq(2)
		expect(c.value).eq(200)
	})

	it('A → B(Nothing) → C', () =>
	{
		var a = Bud()

		var b = join(a, () => Nothing)
		var c = join(b, b => b * 100)

		expect_bud(b)
		expect_bud(c)

		var bs = spy()
		var cs = spy()
		b.on(bs)
		c.on(cs)

		expect(a.value).eq(Nothing)
		expect(b.value).eq(Nothing)
		expect(c.value).eq(Nothing)

		a.emit(1)

		expect(a.value).eq(1)
		expect(b.value).eq(Nothing)
		expect(c.value).eq(Nothing)

		a.emit(2)

		expect(a.value).eq(2)
		expect(b.value).eq(Nothing)
		expect(c.value).eq(Nothing)

		expect(bs.called).false
		expect(cs.called).false
	})

	it('A → B → C multiple emit', () =>
	{
		var a = Bud()

		var b = join(a, a => a + 1)
		var c = join(b, b => b * 100)

		var cs = spy()
		c.on(cs)

		expect(a.value).eq(Nothing)
		expect(b.value).eq(Nothing)
		expect(c.value).eq(Nothing)

		expect(cs.callCount).eq(0)

		a.emit(1)
		a.emit(2)
		a.emit(3)

		expect(a.value).eq(3)
		expect(b.value).eq(4)
		expect(c.value).eq(400)

		expect(cs.callCount).eq(3)
	})
})
