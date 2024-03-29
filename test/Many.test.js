
import Many from 'fluh/lib/Many'


describe('Many', () =>
{
	it('Many()', () =>
	{
		var many = Many(1, 2, 3)

		expect(many).an('array')
		expect(many).deep.eq([ 1, 2, 3 ])

		expect(Many.is(many)).true
		expect(Array.isArray(many)).true
	})

	it('Array is not Many', () =>
	{
		var fake = [ 1, 2, 3 ]

		expect(fake).an('array')
		expect(fake).deep.eq([ 1, 2, 3 ])

		expect(Many.is(fake)).false
		expect(Array.isArray(fake)).true
	})
})
