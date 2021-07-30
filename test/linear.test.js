
import Bud from 'lib/Bud'

import Nothing from 'lib/Nothing'
import Many from 'lib/Many'
import End from 'lib/End'

import join from 'lib/join'

import { state } from './Bud.test'


describe('linear', () =>
{
	it('A → B', () =>
	{
		var a = Bud()

		state(a)

		var b = join(a, a => a + 1)

		state(a,
		{
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			rev: [ a ],
		})

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		a.on(bs1)

		expect(as1.called).false
		expect(bs1.called).false

		a.emit(1)

		var as2 = spy()
		var bs2 = spy()
		a.on(as2)
		a.on(bs2)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 2,
			rev: [ a ],
		})

		expect(as2.callCount).eq(1)
		expect(bs2.callCount).eq(1)
	})

	it('A(v) → B', () =>
	{
		var a = Bud(1)

		state(a,
		{
			value: 1,
		})

		var b = join(a, a => a + 1)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 2,
			rev: [ a ],
		})

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		a.on(bs1)

		expect(as1.called).true
		expect(bs1.called).true

		a.emit(2)

		state(a,
		{
			value: 2,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 3,
			rev: [ a ],
		})

		expect(as1.callCount).eq(2)
		expect(bs1.callCount).eq(2)
	})

	it('A(emit v) → B', () =>
	{
		var a = Bud().emit(1)

		state(a,
		{
			value: 1,
		})

		var b = join(a, a => a + 1)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 2,
			rev: [ a ],
		})

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		a.on(bs1)

		expect(as1.called).true
		expect(bs1.called).true

		a.emit(2)

		state(a,
		{
			value: 2,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 3,
			rev: [ a ],
		})

		expect(as1.callCount).eq(2)
		expect(bs1.callCount).eq(2)
	})

	it('A(End) → B', () =>
	{
		var a = Bud(End)

		state(a,
		{
			value: End,
		})

		var b = join(a, a => a)

		state(a,
		{
			value: End,
		})

		state(b,
		{
			value: End,
		})

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		b.on(bs1)

		expect(as1.called).true
		expect(bs1.called).true

		/* - */
		a.emit(1)

		state(a,
		{
			value: End,
		})

		state(b,
		{
			value: End,
		})

		expect(as1.callCount).eq(1)
		expect(bs1.callCount).eq(1)

		/* - */
		a.emit(End)

		state(a,
		{
			value: End,
		})

		state(b,
		{
			value: End,
		})

		expect(as1.callCount).eq(1)
		expect(bs1.callCount).eq(1)
	})

	it('A(Many) → B', () =>
	{
		var a = Bud(Many(17, 1917))

		state(a,
		{
			value: 1917,
		})

		var b = join(a, a => a)

		state(a,
		{
			value: 1917,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 1917,
			rev: [ a ],
		})
	})

	it('A(End) → B(Live)', () =>
	{
		var a = Bud()

		state(a)

		var b = join(a, a => (a, 0))

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		b.on(bs1)

		state(a,
		{
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			rev: [ a ],
		})

		expect(as1.called).false
		expect(bs1.called).false

		/* - */
		a.emit(1)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 0,
			rev: [ a ],
		})

		expect(as1.callCount).eq(1)
		expect(bs1.callCount).eq(1)

		/* - */
		a.emit(End)

		state(a,
		{
			value: End,
		})

		state(b,
		{
			value: 0,
			rev: [ a ],
		})

		expect(as1.callCount).eq(2)
		expect(bs1.callCount).eq(2)

		/* - */
		a.emit(End)

		state(a,
		{
			value: End,
		})

		state(b,
		{
			value: 0,
			rev: [ a ],
		})

		expect(as1.callCount).eq(2)
		expect(bs1.callCount).eq(2)
	})

	it('A → B(End)', () =>
	{
		var a = Bud(1)

		state(a, { value: 1 })

		var b = join(a, a => (a, End))

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		b.on(bs1)

		state(a,
		{
			value: 1,
		})
		state(b,
		{
			value: End,
		})

		expect(as1.called).true
		expect(bs1.called).true

		/* - */
		a.emit(2)

		state(a,
		{
			value: 2,
		})
		state(b,
		{
			value: End,
		})

		expect(as1.callCount).eq(2)
		expect(bs1.callCount).eq(1)

		/* - */
		a.emit(End)

		state(a,
		{
			value: End,
		})
		state(b,
		{
			value: End,
		})

		expect(as1.callCount).eq(3)
		expect(bs1.callCount).eq(1)
	})

	it('A → B → C', () =>
	{
		var a = Bud()

		var b = join(a, a => a + 1)
		var c = join(b, b => b * 100)

		state(a,
		{
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			rev: [ b ],
		})

		a.emit(1)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 2,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: 200,
			rev: [ b ],
		})
	})

	it('A(v) → B → C', () =>
	{
		var a = Bud(1)

		var b = join(a, a => a + 1)
		var c = join(b, b => b * 100)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 2,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: 200,
			rev: [ b ],
		})
	})

	it('A(emit v) → B → C', () =>
	{
		var a = Bud().emit(1)

		var b = join(a, a => a + 1)
		var c = join(b, b => b * 100)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 2,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: 200,
			rev: [ b ],
		})
	})

	it('A → B(Nothing) → C', () =>
	{
		var a = Bud()

		var b = join(a, () => Nothing)
		var c = join(b, b => b * 100)

		var bs = spy()
		b.on(bs)

		var cs = spy()
		c.on(cs)

		state(a,
		{
			value: Nothing,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: Nothing,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: Nothing,
			rev: [ b ],
		})

		a.emit(1)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: Nothing,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: Nothing,
			rev: [ b ],
		})

		a.emit(2)

		state(a,
		{
			value: 2,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: Nothing,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: Nothing,
			rev: [ b ],
		})

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

		state(a,
		{
			value: Nothing,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: Nothing,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: Nothing,
			rev: [ b ],
		})

		expect(cs.callCount).eq(0)

		a.emit(1)
		a.emit(2)
		a.emit(3)

		state(a,
		{
			value: 3,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 4,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: 400,
			rev: [ b ],
		})

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

		state(a,
		{
			value: Nothing,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: Nothing,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: Nothing,
			rev: [ b ],
		})

		a.emit(5)
		a.emit(6)
		a.emit(7)

		state(a,
		{
			value: 7,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 70,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: 7000,
			rev: [ b ],
		})

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
			if (a % 2) { return a }
			return Nothing
		})
		var c = join(b, b => b * 10)

		var bs = []
		b.on(value => bs.push(value))

		var cs = []
		c.on(value => cs.push(value))

		a
		.emit(0)
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(4)

		expect(bs).deep.eq([ 1, 3 ])
		expect(cs).deep.eq([ 10, 30 ])
	})

	it('A(End) → B → C', () =>
	{
		var a = Bud()
		var b = join(a, a => a)
		var c = join(b, b => b)

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		b.on(bs1)

		var cs1 = spy()
		c.on(cs1)

		state(a,
		{
			value: Nothing,
			deps:  [ b ],
			order: [ b, c ],
		})

		state(b,
		{
			value: Nothing,
			deps:  [ c ],
			order: [ c ],
			rev: [ a ],
		})

		state(c,
		{
			value: Nothing,
			rev: [ b ],
		})

		expect(as1.called).false
		expect(bs1.called).false
		expect(cs1.called).false

		/* - */
		a.emit(End)

		state(a,
		{
			value: End,
		})

		state(b,
		{
			value: End,
		})

		state(c,
		{
			value: End,
		})

		expect(as1.callCount).eq(1)
		expect(bs1.callCount).eq(1)
		expect(cs1.callCount).eq(1)
	})

	it('Zero, A → B', () =>
	{
		var a = Bud()
		a.emit(1)

		state(a, { value: 1 })

		var Z = Bud()
		Z.emit(1)

		state(Z, { value: 1 })

		var b = a.map(x => x + 1)

		state(b,
		{
			value: 2,
			rev: [ a ],
		})
	})

	it('pass undefined', () =>
	{
		var a = Bud()
		var b = join(a, a => void a)

		a.emit(1)

		expect(b.value).eq(void 0)
	})
})
