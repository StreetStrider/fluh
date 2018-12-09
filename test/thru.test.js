
import Bud from 'lib/Bud'


describe('thru', () =>
{
	it('works', () =>
	{
		var mono = Bud()

		var a = Bud()
		var b = a.thru(bud =>
		{
			expect(bud).eq(a)

			return mono
		})

		expect(b).eq(mono)
	})
})
