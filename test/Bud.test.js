
import Bud from 'lib/Bud'
import Nothing from 'lib/Nothing'
import Many from 'lib/Many'

describe('Bud', () =>
{
	it('Bud()', () =>
	{
		var bud = Bud()

		expect_bud(bud)

		expect(bud.value).eq(Nothing)
	})

	it('emit', () =>
	{
		var bud = Bud()

		var r = bud.emit(1917)

		expect_bud(bud)
		expect(r).eq(bud)

		expect(bud.value).eq(1917)
	})

	it('emit multiple', () =>
	{
		var bud = Bud()

		var r = bud.emit(17).emit(1917)

		expect_bud(bud)
		expect(r).eq(bud)

		expect(bud.value).eq(1917)
	})

	it('emit Nothing', () =>
	{
		var bud = Bud()

		bud.emit(1917)
		expect(bud.value).eq(1917)

		bud.emit(Nothing)
		/* value remains the same as before */
		expect(bud.value).eq(1917)

		bud.emit() /* Nothing */
		expect(bud.value).eq(1917)
	})

	it('emit Many', () =>
	{
		var bud = Bud()

		bud.emit(Many(17, 1917))
		expect(bud.value).eq(1917)
	})

	it('emit Many with Nothing', () =>
	{
		var bud = Bud()

		bud.emit(Many(Nothing, Nothing, Nothing))

		expect(bud.value).eq(Nothing)
	})

	it('emit Many with leading Nothing', () =>
	{
		var bud = Bud()

		bud.emit(Many(Nothing, 17, 1917))

		expect(bud.value).eq(1917)
	})
})

export function expect_bud (bud)
{
	expect(bud).an('object')

	expect(bud.constructor).eq(Bud)

	expect(bud).property('id')
	expect(bud.id).a('string')
	expect(bud.id).match(/^#\d+$/)

	expect(bud).property('value')

	expect(bud.emit).a('function')
	expect(bud.on).a('function')
	expect(bud.map).a('function')
	expect(bud.thru).a('function')
}
