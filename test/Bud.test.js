
import Bud from 'lib/Bud'
import Nothing from 'lib/Nothing'

describe('Bud', () =>
{
	it('Bud()', () =>
	{
		var bud = Bud()

		expect_bud(bud)

		expect(bud.value).eq(Nothing)
	})

	it('Bud(fn)', () =>
	{
		var bud = Bud(() => 1917)

		expect_bud(bud)

		expect(bud.value).eq(Nothing)
	})
})

export default function expect_bud (bud)
{
	expect(bud).an('object')

	expect(bud.constructor).eq(Bud)

	expect(bud).property('id')
	expect(bud.id).a('string')
	expect(bud.id).match(/^B\/\d+$/)

	expect(bud).property('value')
	expect(bud.value).eq(Nothing)

	expect(bud.evaluate).a('function')
	expect(bud.emit).a('function')
}
