
import End from 'fluh/lib/End'

import Bud from 'fluh/lib/Bud'
import turnoff from 'fluh/lib/turnoff'

import { when_data } from 'fluh/map/when'

import { state } from './Bud.test'


describe('turnoff', () =>
{
	it('works', () =>
	{
		var a = Bud()
		var b = a.map(when_data(v => (v * 2)))

		turnoff(b, a)

		var rs = []
		b.on(v => rs.push(v))

		b
		.emit(100)
		.emit(End)

		a
		.emit(1)
		.emit(2)
		.emit(3)

		expect(rs).deep.eq([ 100, End ])

		state(a, { value: End })
		state(b, { value: End })
	})
})
