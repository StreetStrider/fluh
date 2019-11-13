
import Bud from 'lib/Bud'
import join from 'lib/join'
import Nothing from 'lib/Nothing'
import Many from 'lib/Many'

describe('triangle', () =>
{
	it('A,B,C; B → C', () =>
	{
		var a = Bud().emit(1)

		var b = join(a, a => a * 10)
		var c = join(a, b, (a, b) => a * 100 + b)

		var s = spy()
		c.on(s)

		expect(b.value).eq(10)
		expect(c.value).eq(110)

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

		expect(c1.value).eq('A/A.B1.C1')
		expect(c2.value).eq('A.B1.B2/A/A.B1.C1.C2')

		expect(s.callCount).eq(1)

		a.emit('B')

		expect(s.callCount).eq(2)
	})
})
