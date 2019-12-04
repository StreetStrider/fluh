
import Bud from 'lib/Bud'

import Nothing from 'lib/Nothing'
import Many from 'lib/Many'
import End from 'lib/End'

import join from 'lib/join'

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
		var a = Bud(1)

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

	it('A(emit v) → B', () =>
	{
		var a = Bud().emit(1)

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

	it('A(End) → B', () =>
	{
		var a = Bud(End)

		var b = join(a, a => a)

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		b.on(bs1)

		expect(a.value).eq(End)
		expect(b.value).eq(End)
		expect(as1.called).true
		expect(bs1.called).true

		a.emit(1)

		expect(as1.callCount).eq(1)
		expect(bs1.callCount).eq(1)
	})

	it('A → B(End)', () =>
	{
		var a = Bud(1)

		var b = join(a, a => (a, End))

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		b.on(bs1)

		expect(a.value).eq(1)
		expect(b.value).eq(End)
		expect(as1.called).true
		expect(bs1.called).true

		a.emit(2)

		expect(a.value).eq(2)
		expect(b.value).eq(End)
		expect(as1.callCount).eq(2)
		expect(bs1.callCount).eq(1)
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
		var a = Bud(1)

		var b = join(a, a => a + 1)
		var c = join(b, b => b * 100)

		expect(a.value).eq(1)
		expect(b.value).eq(2)
		expect(c.value).eq(200)
	})

	it('A(emit v) → B → C', () =>
	{
		var a = Bud().emit(1)

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

	it('A → B(Many) → C', () =>
	{
		var a = Bud()

		var b = join(a, a => Many(a, a * 10))
		var c = join(b, b => b * 100)

		var order = []

		var as = []
		a.on(track('a'))
		a.on(value => as.push(value))

		var bs = []
		b.on(track('b'))
		b.on(value => bs.push(value))

		var cs = []
		c.on(track('c'))
		c.on(value => cs.push(value))

		expect(a.value).eq(Nothing)
		expect(b.value).eq(Nothing)
		expect(c.value).eq(Nothing)

		a.emit(5)
		a.emit(6)
		a.emit(7)

		expect(a.value).eq(7)
		expect(b.value).eq(70)
		expect(c.value).eq(7000)

		expect(as).deep.eq([ 5, 6, 7 ])
		expect(bs).deep.eq([ 5, 50, 6, 60, 7, 70 ])
		expect(cs).deep.eq([ 500, 5000, 600, 6000, 700, 7000 ])
		expect(order).deep.eq(
		[
			[ 'a', 5 ],
			[ 'b', 5 ],
			[ 'c', 500 ],
			[ 'b', 50 ],
			[ 'c', 5000 ],
			[ 'a', 6 ],
			[ 'b', 6 ],
			[ 'c', 600 ],
			[ 'b', 60 ],
			[ 'c', 6000 ],
			[ 'a', 7 ],
			[ 'b', 7 ],
			[ 'c', 700 ],
			[ 'b', 70 ],
			[ 'c', 7000 ],
		])

		function track (name)
		{
			return (value) =>
			{
				order.push([ name, value ])

				return value
			}
		}
	})

	it('A → B(Many) → C(Many)', () =>
	{
		var a = Bud()

		var b = join(a, a => Many(a, (a + 1)))
		var c = join(b, b => Many(b, (b + 2)))

		var order = []

		var as = []
		a.on(track('a'))
		a.on(value => as.push(value))

		var bs = []
		b.on(track('b'))
		b.on(value => bs.push(value))

		var cs = []
		c.on(track('c'))
		c.on(value => cs.push(value))

		expect(a.value).eq(Nothing)
		expect(b.value).eq(Nothing)
		expect(c.value).eq(Nothing)

		a.emit(1)
		a.emit(5)
		a.emit(9)

		expect(a.value).eq(9)
		expect(b.value).eq(10)
		expect(c.value).eq(12)

		expect(as).deep.eq([ 1, 5, 9 ])
		expect(bs).deep.eq([ 1, 2, 5, 6, 9, 10 ])
		expect(cs).deep.eq([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ])

		expect(order).deep.eq(
		[
			[ 'a', 1 ],
			[ 'b', 1 ],
			[ 'c', 1 ],
				[ 'b', 2 ],
				[ 'c', 2 ],
					[ 'c', 3 ],
					[ 'c', 4 ],

			[ 'a', 5 ],
			[ 'b', 5 ],
			[ 'c', 5 ],
				[ 'b', 6 ],
				[ 'c', 6 ],
					[ 'c', 7 ],
					[ 'c', 8 ],

			[ 'a', 9 ],
			[ 'b', 9 ],
			[ 'c', 9 ],
				[ 'b', 10 ],
				[ 'c', 10 ],
					[ 'c', 11 ],
					[ 'c', 12 ],
			])

		function track (name)
		{
			return (value) =>
			{
				order.push([ name, value ])

				return value
			}
		}
	})

	it('A → B(Nothing) → C', () =>
	{
		var a = Bud()

		var b = join(a, () => Nothing)
		var c = join(b, b => b * 10)

		var bs = []
		b.on(value => bs.push(value))

		var cs = []
		c.on(value => cs.push(value))

		a.emit(1).emit(2).emit(3)

		expect(bs).deep.eq([])
		expect(cs).deep.eq([])
	})

	it('A → B(maybe Nothing) → C', () =>
	{
		var a = Bud()

		var b = join(a, a =>
		{
			if (a > 1) { return Nothing }
			return a
		})
		var c = join(b, b => b * 10)

		var bs = []
		b.on(value => bs.push(value))

		var cs = []
		c.on(value => cs.push(value))

		a.emit(1).emit(2).emit(3)

		expect(bs).deep.eq([ 1 ])
		expect(cs).deep.eq([ 10 ])
	})

	it('Zero, A → B', () =>
	{
		var a = Bud()
		a.emit(1)

		var Z = Bud()
		Z.emit(1)

		var b = a.map(x => x + 1)

		expect(b.value).eq(2)
	})
})
