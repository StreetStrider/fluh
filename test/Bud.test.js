
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

	it('emit', () =>
	{
		var bud = Bud(() => 1)

		var r = bud.emit(1917)

		expect_bud(bud)
		expect(r).eq(bud)
		expect(r.value).eq(1917)

		var r = bud.emit(Nothing)

		expect_bud(bud)
		expect(r).eq(bud)
		expect(r.value).eq(1917)
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

	expect(bud.evaluate).a('function')
	expect(bud.emit).a('function')
}
