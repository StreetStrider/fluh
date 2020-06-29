
import * as index from '../'


describe('index', () =>
{
	it('exports', () =>
	{
		expect(index.Bud).a('function')

		expect(index.Nothing).a('symbol')
		expect(index.Many).a('function')
		expect(index.End).a('symbol')

		expect(index.Noop).a('function')
		expect(index.Same).a('function')
		expect(index.Fin).a('function')

		expect(index.join).a('function')
		expect(index.turnoff).a('function')
		expect(index.resource).a('function')

		expect(index.asap).a('function')
		expect(index.capture).a('function')
		expect(index.concat).a('function')
		expect(index.drain).a('function')
	})
})
