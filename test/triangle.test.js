/* eslint-disable template-curly-spacing */

import Bud from 'lib/Bud'

import Nothing from 'lib/Nothing'
import Many from 'lib/Many'
import End from 'lib/End'

import join from 'lib/join'

import { state } from './Bud.test'


describe('triangle', () =>
{
	it('A,B,C; B → C', () =>
	{
		var a = Bud().emit(1)

		var b = join(a, a => a * 10)
		var c = join(a, b, (a, b) => a * 100 + b)

		var s = spy()
		c.on(s)

		state(a,
		{
			value: 1,
			deps: [ b, c ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 10,
			inv: [ a ],
			deps: [ c ],
			order: [ c ],
		})

		state(c,
		{
			value: 110,
			inv: [ a, b ],
		})

		expect(s.callCount).eq(1)

		a.emit(2)

		expect(s.callCount).eq(2)
	})

	it('A,B,C; B → C with Many', () =>
	{
		var a = Bud().emit(1)

		var b = join(a, a => a * 10)
		var c = join(a, b, (a, b) => a * 100 + b)

		var s = spy()
		c.on(s)

		expect(b.value).eq(10)
		expect(c.value).eq(110)

		expect(s.callCount).eq(1)

		a.emit(Many(Nothing, 2))

		expect(s.callCount).eq(2)
	})

	it('triangle in triangle', () =>
	{
		var a = Bud().emit('A')

		var b1 = join(a, a => a + '.B1')
		var c1 = join(a, b1, (a, b) => `${a}/${b}.C1`)

		var b2 = join(b1, b => b + '.B2')
		var c2 = join(b2, c1, (b, c) => `${b}/${c}.C2`)

		var s = spy()
		c2.on(s)

		state(a,
		{
			value: 'A',
			deps: [ b1, c1 ],
			order: [ b1, b2, c1, c2 ],
		})

		state(b1,
		{
			value: 'A.B1',
			inv: [ a ],
			deps: [ c1, b2 ],
			order: [ c1, b2, c2 ],
		})

		state(c1,
		{
			value: 'A/A.B1.C1',
			inv: [ a, b1 ],
			deps: [ c2 ],
			order: [ c2 ],
		})

		state(b2,
		{
			value: 'A.B1.B2',
			inv: [ b1 ],
			deps: [ c2 ],
			order: [ c2 ],
		})

		state(c2,
		{
			value: 'A.B1.B2/A/A.B1.C1.C2',
			inv: [ b2, c1 ],
		})

		expect(s.callCount).eq(1)

		a.emit('B')

		expect(s.callCount).eq(2)
	})

	it('A,B(End),C; B → C', () =>
	{
		var a = Bud(1)

		var b = join(a, a =>
		{
			if (a === 3)
			{
				return End
			}

			return a
		})

		var c = join(a, b, (a, b) => (b, a))

		var s = spy()
		c.on(s)

		state(a,
		{
			value: 1,
			deps: [ b, c ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 1,
			inv: [ a ],
			deps: [ c ],
			order: [ c ],
		})

		state(c,
		{
			value: 1,
			inv: [ a, b ],
		})

		expect(s.callCount).eq(1)

		/* - */
		a.emit(2)

		state(a,
		{
			value: 2,
			deps: [ b, c ],
			order: [ b, c ],
		})

		state(b,
		{
			value: 2,
			inv: [ a ],
			deps: [ c ],
			order: [ c ],
		})

		state(c,
		{
			value: 2,
			inv: [ a, b ],
		})

		expect(s.callCount).eq(2)

		/* - */
		a.emit(3)

		state(a,
		{
			value: 3,
			deps: [ c ],
			order: [ c ],
		})

		state(b,
		{
			value: End,
		})

		state(c,
		{
			value: 3,
			inv: [ a, b ],
		})

		expect(s.callCount).eq(3)

		/* - */
		a.emit(4)

		state(a,
		{
			value: 4,
			deps: [ c ],
			order: [ c ],
		})

		state(b,
		{
			value: End,
		})

		state(c,
		{
			value: 4,
			inv: [ a, b ],
		})

		expect(s.callCount).eq(4)
	})
})
