
import Bud from 'lib/Bud'
import Nothing from 'lib/Nothing'

describe('Bud', () =>
{
	it('Bud()')

	it('Bud(fn)', () =>
	{
		var bud = Bud()

		expect(bud).an('object')

		expect(bud.constructor).eq(Bud)

		expect(bud).property('id')
		expect(bud.id).a('string')
		expect(bud.id).match(/^B\/\d+$/)

		expect(bud).property('value')
		expect(bud.value).eq(Nothing)

		expect(bud.evaluate).a('function')
		expect(bud.emit).a('function')
	})
})
