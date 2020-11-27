
import { inspect } from 'util'

import Bud from 'lib/Bud'
import debug from 'lib/debug'


function as_inspect (value, options)
{
	return inspect(value, { colors: true, depth: 2, ...options })
}


describe('Log', () =>
{
	var log
	var calls = []
	var last = null

	var object1 =
	{
		x:
		{
			y: [ 1, 2, 3 ],
		},
	}
	var object2 =
	{
		x:
		{
			y:
			{
				z: [ 1, 2, 3 ],
			}
		}
	}

	beforeEach(() =>
	{
		log = console.log
		console.log = (...args) =>
		{
			calls.push(args)
			last = args
		}
	})

	afterEach(() =>
	{
		console.log = log
		calls = []
		last = null
	})

	it('works', () =>
	{
		var a = Bud()
		var ds = a.thru(debug())

		expect(calls.length).eq(0)

		a.emit(object1)
		expect(last).deep.eq([ a.id, as_inspect(object1) ])
		expect(calls.length).eq(1)

		a.emit(object2)
		expect(last).deep.eq([ a.id, as_inspect(object2) ])
		expect(calls.length).eq(2)

		ds()

		a.emit(object2)
		expect(last).deep.eq([ a.id, as_inspect(object2) ])
		expect(calls.length).eq(2)
	})

	it('label', () =>
	{
		var a = Bud()
		var ds = a.thru(debug('label'))

		expect(calls.length).eq(0)

		a.emit(object1)
		expect(last).deep.eq([ 'label', as_inspect(object1) ])
		expect(calls.length).eq(1)

		a.emit(object2)
		expect(last).deep.eq([ 'label', as_inspect(object2) ])
		expect(calls.length).eq(2)

		ds()

		a.emit(object2)
		expect(last).deep.eq([ 'label', as_inspect(object2) ])
		expect(calls.length).eq(2)
	})

	it('options', () =>
	{
		var a = Bud()
		var ds = a.thru(debug({ label: 'label', depth: 1 }))

		expect(calls.length).eq(0)

		a.emit(object1)
		expect(last).deep.eq([ 'label', as_inspect(object1, { depth: 1 }) ])
		expect(calls.length).eq(1)

		a.emit(object2)
		expect(last).deep.eq([ 'label', as_inspect(object2, { depth: 1 }) ])
		expect(calls.length).eq(2)

		ds()

		a.emit(object2)
		expect(last).deep.eq([ 'label', as_inspect(object2, { depth: 1 }) ])
		expect(calls.length).eq(2)
	})

	it('options', () =>
	{
		var a = Bud()
		var ds = a.thru(debug({ depth: 1 }))

		expect(calls.length).eq(0)

		a.emit(object1)
		expect(last).deep.eq([ a.id, as_inspect(object1, { depth: 1 }) ])
		expect(calls.length).eq(1)

		a.emit(object2)
		expect(last).deep.eq([ a.id, as_inspect(object2, { depth: 1 }) ])
		expect(calls.length).eq(2)

		ds()

		a.emit(object2)
		expect(last).deep.eq([ a.id, as_inspect(object2, { depth: 1 }) ])
		expect(calls.length).eq(2)
	})

	it('options', () =>
	{
		var a = Bud()
		var ds = a.thru(debug('label', { depth: 3 }))

		expect(calls.length).eq(0)

		a.emit(object1)
		expect(last).deep.eq([ 'label', as_inspect(object1, { depth: 3 }) ])
		expect(calls.length).eq(1)

		a.emit(object2)
		expect(last).deep.eq([ 'label', as_inspect(object2, { depth: 3 }) ])
		expect(calls.length).eq(2)

		ds()

		a.emit(object2)
		expect(last).deep.eq([ 'label', as_inspect(object2, { depth: 3 }) ])
		expect(calls.length).eq(2)
	})
})
