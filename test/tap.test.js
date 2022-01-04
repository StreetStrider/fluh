
import tap from 'fluh/lib/tap'


describe('tap', () =>
{
	it('not mutate', () =>
	{
		var mut = 0

		function mutate (value)
		{
			mut = ('m' + value)

			return 'd'
		}

		var T = tap(mutate)

		expect(mut).eq(0)

		var R = T('a', 'b', 'c')

		expect(R).eq('a')
		expect(mut).eq('ma')
	})

	it('receives all arguments', () =>
	{
		function receiver (...args)
		{
			expect(args).deep.eq([ 'a', 'b', 'c' ])
		}

		var T = tap(receiver)

		T('a', 'b', 'c')
	})
})
