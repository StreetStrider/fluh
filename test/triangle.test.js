
import Bud from 'lib/Bud'
import join from 'lib/join'

describe('triangle', () =>
{
	it('A,B,C; B → C', () =>
	{
		var a = Bud(() => 1)

		var b = join(a, a => a * 10)
		var c = join(a, b, (a, b) => a * 100 + b)

		expect(b.value).eq(10)
		expect(c.value).eq(110)
	})

	it('triangle in triangle', () =>
	{
		var a = Bud(() => 'A')

		var b1 = join(a, a => a + '.B1')
		var c1 = join(a, b1, (a, b) => `${a}/${b}.C1`)

		var b2 = join(b1, b => b + '.B2')
		var c2 = join(b2, c1, (b, c) => `${b}/${c}.C2`)

		expect(c1.value).eq('A/A.B1.C1')
		expect(c2.value).eq('A.B1.B2/A/A.B1.C1.C2')
	})
})