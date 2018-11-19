
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

		expect(bud.value).eq(Nothing) /* < TODO */
	})

	it('emit', () =>
	{
		var bud = Bud()

		var r = bud.emit(1917)

		expect_bud(bud)
		expect(r).eq(bud)

		expect(bud.value).eq(1917)
	})

	it('emit Nothing', () =>
	{
		var bud = Bud()

		bud.emit(1917)
		bud.emit(Nothing)

		/* value remains the same as before */
		expect(bud.value).eq(1917)
	})

	it('pull', () =>
	{
		var c = Symbol('c')

		var bud = Bud(() => c)
		expect(bud.value).eq(Nothing) /* < TODO */

		var r = bud.pull()

		/* value changes */
		expect(r).eq(c)
		expect(bud.value).eq(c)
	})

	it('pull Nothing', () =>
	{
		var c = Symbol('c')

		var bud = Bud(() => Nothing)

		expect(bud.value).eq(Nothing)
		bud.emit(c)
		expect(bud.value).eq(c)

		var r = bud.pull()

		expect(r).eq(Nothing)
		/* value remains the same as before */
		expect(bud.value).eq(c)
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

	expect(bud.pull).a('function')
	expect(bud.emit).a('function')
}
