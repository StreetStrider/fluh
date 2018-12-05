
import Log from 'lib/Log/Log'


describe('Log', () =>
{
	before(() =>
	{
		spy(console, 'log')
	})

	after(() =>
	{
		console.log.restore()
	})

	it('enabled', () =>
	{
		var L = Log()

		expect(L.inspect(1)).eq(void 0)

		L(' ')
		expect(console.log.callCount).eq(0)

		L.enabled = true

		expect(L.inspect(1)).eq('\u001b[33m1\u001b[39m')

		L(' ')
		expect(console.log.callCount).eq(1)
	})
})
