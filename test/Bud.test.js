
import Bud from 'fluh/lib/Bud'

import Nothing from 'fluh/lib/Nothing'
import Many from 'fluh/lib/Many'
import End from 'fluh/lib/End'

import domain from 'fluh/lib/_/domain'


describe('Bud', () =>
{
	it('Bud.is', () =>
	{
		expect(Bud.is(Bud())).true
		expect(Bud.is(Bud(false))).true

		expect(Bud.is(17)).false
		expect(Bud.is({})).false
		expect(Bud.is({ x: 1 })).false
		expect(Bud.is({ constructor: Bud })).false
		expect(Bud.is(true)).false
		expect(Bud.is([ 1, 2, 3 ])).false
	})

	it('Bud()', () =>
	{
		var bud = Bud()

		state(bud)
	})

	it('Bud(Nothing)', () =>
	{
		var bud = Bud(Nothing)

		state(bud)
	})

	it('Bud(value)', () =>
	{
		var bud = Bud(1917)

		state(bud, { value: 1917 })
	})

	it('Bud(undefined)', () =>
	{
		var bud = Bud(void 0)

		/* state(bud, { value: void 0 }) */
		expect(bud.value).eq(void 0)
	})

	it('Bud(Many)', () =>
	{
		var bud = Bud(Many(17, 1917))
		state(bud, { value: 1917 })
	})

	it('Bud(Many with Nothing)', () =>
	{
		var bud = Bud(Many(Nothing, Nothing, Nothing))
		state(bud)

		var bud = Bud(Many(17, Nothing, 1917))
		state(bud, { value: 1917 })

		var bud = Bud(Many(Nothing, 17, 1917))
		state(bud, { value: 1917 })

		var bud = Bud(Many(17, 1917, Nothing))
		state(bud, { value: 1917 })
	})

	it('Bud(Many with End)', () =>
	{
		var bud = Bud(Many(End, End, End))
		state(bud, { value: End })

		var bud = Bud(Many(17, End, 1917))
		state(bud, { value: End })

		var bud = Bud(Many(End, 17, 1917))
		state(bud, { value: End })

		var bud = Bud(Many(17, 1917, End))
		state(bud, { value: End })
	})

	it('emit', () =>
	{
		var bud = Bud()

		var r = bud.emit(1917)

		expect_bud(bud)
		expect_bud(r)

		expect(r).eq(bud)

		state(bud, { value: 1917 })
	})

	it('emit multiple', () =>
	{
		var bud = Bud()

		var s = spy()
		bud.on(s)

		bud.emit(17).emit(1917)

		state(bud, { value: 1917 })
		expect(s.callCount).eq(2)
	})

	it('emit Nothing', () =>
	{
		var bud = Bud()

		var s = spy()
		bud.on(s)

		bud.emit(1917)
		state(bud, { value: 1917 })

		bud.emit(Nothing)
		/* value remains the same as before */
		state(bud, { value: 1917 })

		expect(s.callCount).eq(1)

		bud.emit() /* Nothing */
		state(bud, { value: 1917 })

		expect(s.callCount).eq(1)
	})

	it('emit undefined', () =>
	{
		var bud = Bud()

		var s = spy()
		bud.on(s)

		bud.emit(void 0)
		/* state(bud, { value: void 0 }) */
		expect(bud.value).eq(void 0)

		bud.emit(void 0)
		/* state(bud, { value: void 0 }) */
		expect(bud.value).eq(void 0)

		expect(s.callCount).eq(2)
	})

	it('emit Many', () =>
	{
		var bud = Bud()

		var s = spy()
		bud.on(s)

		bud.emit(Many(17, 1917))

		state(bud, { value: 1917 })
		expect(s.callCount).eq(2)
	})

	it('emit Many with Nothing', () =>
	{
		var bud = Bud()

		var s = spy()
		bud.on(s)

		bud.emit(Many(Nothing, Nothing, Nothing))

		state(bud)
		expect(s.callCount).eq(0)
	})

	it('emit Many with leading Nothing', () =>
	{
		var bud = Bud()

		var s = spy()
		bud.on(s)

		bud.emit(Many(Nothing, 17, 1917))

		state(bud, { value: 1917 })
		expect(s.callCount).eq(2)
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

	expect(bud.sample).a('function')
	expect(bud.emit).a('function')
	expect(bud.on).a('function')
	expect(bud.map).a('function')
	expect(bud.thru).a('function')
}

export function state (bud, descr = {})
{
	expect_bud(bud)

	var { value = Nothing } = descr

	var { deps = [] } = descr
	var { rev  = void 0 } = descr
	var { order = [] } = descr

	expect(bud.value).deep.eq(value)
	expect(bud.sample()).deep.eq(value)

	var st = domain.state(bud)

	expect(st.direct).deep.eq(deps)
	expect(st.reverse).deep.eq(rev)
	expect(st.order).deep.eq(order)
}
