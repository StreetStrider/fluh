
import Bud from 'fluh/lib/Bud'

import delay from 'fluh/thru/delay'
import defer from 'fluh/thru/defer'
import raf   from 'fluh/thru/raf'

import End from 'fluh/lib/End'
import concat from 'fluh/lib/concat'


describe('delay / defer / raf', () =>
{
	it('delay', async () =>
	{
		var a = Bud()
		var b = a.thru(delay(10))

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		expect(await concat(b)).deep.eq([ 1, 2, 3, End ])
	})

	it('delay with default', async () =>
	{
		var a = Bud()
		var b = a.thru(delay())

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		expect(await concat(b)).deep.eq([ 1, 2, 3, End ])
	})

	it('defer', async () =>
	{
		var a = Bud()
		var b = a.thru(defer)

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		expect(await concat(b)).deep.eq([ 1, 2, 3, End ])
	})

	it('raf', async () =>
	{
		var a = Bud()
		var b = a.thru(raf)

		var rs = []
		b.on(value => rs.push(value))

		a
		.emit(1)
		.emit(2)
		.emit(3)
		.emit(End)

		expect(await concat(b)).deep.eq([ 1, 2, 3, End ])
	})
})
