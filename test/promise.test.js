
import Bud from 'lib/Bud'

import * as promise from 'thru/promise'

import End from 'lib/End'
import concat from 'lib/concat'


describe('promise', () =>
{
	it('every', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.every)

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'c'))
		.emit(delay.resolve(0, 'a'))
		.emit(delay.resolve(1, 'b'))
		.emit(delay.resolve(3, End))

		expect(await concat(b)).deep.eq([ 'a', 'b', 'c', End ])
	})

	it('every catch', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.every)

		var e = new Error('x')

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'c'))
		.emit(delay.resolve(0, 'a'))
		.emit(delay.reject(1, e))
		.emit(delay.resolve(3, End))

		expect(await concat(b)).deep.eq([ 'a', e, 'c', End ])
	})

	it('every heterohenous', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.every)

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'c'))
		.emit('a')
		.emit(delay.resolve(1, 'b'))
		.emit(delay.resolve(3, End))

		expect(await concat(b)).deep.eq([ 'a', 'b', 'c', End ])
	})

	it('last', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.last)

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'c'))
		.emit(delay.resolve(0, 'a'))
		.emit(delay.resolve(1, 'b'))

		delay.resolve(3).then(() => a.emit(Promise.resolve(End)))

		expect(await concat(b)).deep.eq([ 'b', End ])
	})

	it('last catch', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.last)

		var e1 = new Error('x')
		var e2 = new Error('y')

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.reject(2, e2))
		.emit(delay.resolve(0, 'a'))
		.emit(delay.reject(1, e1))

		delay.resolve(3).then(() => a.emit(Promise.resolve(End)))

		expect(await concat(b)).deep.eq([ e1, End ])
	})

	it('last heterohenous', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.last)

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'c'))
		.emit('a')
		.emit(delay.resolve(1, 'b'))

		delay.resolve(3).then(() => a.emit(Promise.resolve(End)))

		expect(await concat(b)).deep.eq([ 'b', End ])
	})

	it('buffered', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.buffered(3))

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'a'))
		.emit(delay.resolve(0, 'b'))
		.emit(delay.resolve(1, 'c'))
		.emit(delay.resolve(4, 'd'))
		.emit(delay.resolve(3, 'e'))

		delay.resolve(5).then(() => a.emit(Promise.resolve(End)))

		expect(await concat(b)).deep.eq([ 'c', 'd', 'e', End ])
	})

	it('buffered(1)', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.buffered(1))

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'c'))
		.emit(delay.resolve(0, 'a'))
		.emit(delay.resolve(1, 'b'))

		delay.resolve(3).then(() => a.emit(Promise.resolve(End)))

		expect(await concat(b)).deep.eq([ 'b', End ])
	})

	it('buffered catch', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.buffered(3))

		var e = new Error('x')

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'a'))
		.emit(delay.resolve(0, 'b'))
		.emit(delay.resolve(1, 'c'))
		.emit(delay.reject(4, e))
		.emit(delay.resolve(3, 'e'))

		delay.resolve(5).then(() => a.emit(Promise.resolve(End)))

		expect(await concat(b)).deep.eq([ 'c', e, 'e', End ])
	})

	it('buffered heterohenous', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.buffered(3))

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(2, 'a'))
		.emit(delay.resolve(0, 'b'))
		.emit(delay.resolve(1, 'c'))
		.emit('d')
		.emit(delay.resolve(3, 'e'))

		delay.resolve(5).then(() => a.emit(Promise.resolve(End)))

		expect(await concat(b)).deep.eq([ 'c', 'd', 'e', End ])
	})

	it('buffered smooth', async () =>
	{
		var a = Bud()
		var b = a.thru(promise.buffered(3))

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(delay.resolve(0, 'a'))
		.emit(delay.resolve(1, 'b'))
		.emit(delay.resolve(2, 'c'))

		delay.resolve(3).then(() =>
		{
			a
			.emit(delay.resolve(0, 'd'))
			.emit(delay.resolve(1, 'e'))
			.emit(delay.resolve(2, End))
		})

		expect(await concat(b)).deep.eq([ 'a', 'b', 'c', 'd', 'e', End ])
	})
})

var delay =
{
	resolve (n, value)
	{
		return new Promise(rs =>
		{
			setTimeout(() => rs(value), (20 * n))
		})
	},
	reject (n, value)
	{
		return delay
		.resolve(n)
		.then(() => { throw value })
	},
}
