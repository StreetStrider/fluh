
import Bud from 'lib/Bud'
import Nothing from 'lib/Nothing'
import join from 'lib/join'

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

		expect(bud.value).eq(1917)
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
		expect(bud.value).eq(1917)

		bud.emit(Nothing)
		/* value remains the same as before */
		expect(bud.value).eq(1917)
	})

	it('pull', () =>
	{
		var L = [ 1, 2, 3 ]

		var bud = Bud(() => L.shift())
		expect(bud.value).eq(1)

		var r = bud.pull()
		expect(r).eq(2)
		expect(bud.value).eq(2)

		var r = bud.pull()
		expect(r).eq(3)
		expect(bud.value).eq(3)
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

	it('effects', () =>
	{
		var bud = Bud()

		var ok = false

		bud.on((value) => { ok = (value === 17) })

		var s = spy()
		bud.on(s)

		bud.emit(17)

		expect(ok).true
		expect(s.callCount).eq(1)
	})

	it('effects instant', () =>
	{
		var bud = Bud(() => 17)

		var ok = false

		bud.on((value) => { ok = (value === 17) })

		var s = spy()
		bud.on(s)

		expect(ok).true
		expect(s.callCount).eq(1)
	})

	it('effects multiple', () =>
	{
		var bud = Bud()

		var rs = []

		bud.on((value) => rs.push([ 1, value ]))
		bud.on((value) => rs.push([ 2, value ]))

		bud.emit(17)
		bud.emit(1917)

		expect(rs).deep.eq(
		[
			[ 1, 17 ],
			[ 2, 17 ],
			[ 1, 1917 ],
			[ 2, 1917 ],
		])
	})

	it('effects on pull', () =>
	{
		var b1 = Bud()
		var b2 = join(b1, v => v)

		var rs = []

		b2.on((value) => rs.push([ 1, value ]))
		b2.on((value) => rs.push([ 2, value ]))

		b1.emit(17)
		b1.emit(1917)

		expect(rs).deep.eq(
		[
			[ 1, 17 ],
			[ 2, 17 ],
			[ 1, 1917 ],
			[ 2, 1917 ],
		])
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

	expect(bud.pull).a('function')
	expect(bud.emit).a('function')
	expect(bud.on).a('function')
}
