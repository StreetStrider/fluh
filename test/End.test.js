
import Bud from 'lib/Bud'
import Many from 'lib/Many'
import End from 'lib/End'

import { state } from './Bud.test'


describe('End', () =>
{
	it('ends and ignores other', () =>
	{
		var a = Bud()

		var b = a.map(v => v)

		var rs = []
		b.on(value => rs.push(value))

		var s = spy()
		b.on(s)

		state(a,
		{
			deps: [ b ]
		})
		state(b,
		{
			inv: [ a ]
		})

		a.emit(1)
		a.emit(2)
		a.emit(3)

		state(a,
		{
			value: 3,
			deps: [ b ]
		})
		state(b,
		{
			value: 3,
			inv: [ a ]
		})

		a.emit(End)
		a.emit(4)
		a.emit(End)
		a.emit(5)
		a.emit(End)

		state(a, { value: End })
		state(b, { value: End })

		expect(rs).deep.eq([ 1, 2, 3, End ])
		expect(s.callCount).eq(4)
	})

	it('End work in the middle of Many', () =>
	{
		var a = Bud()

		var b = a.map(v => v)

		var rs = []
		b.on(value => rs.push(value))

		var s = spy()
		b.on(s)

		a.emit(1)
		a.emit(Many(2, 3, End))
		a.emit(4)
		a.emit(End)
		a.emit(Many(5, 6))

		state(a, { value: End })
		state(b, { value: End })

		expect(rs).deep.eq([ 1, 2, 3, End ])
		expect(s.callCount).eq(4)
	})

	it('initially ended', () =>
	{
		var a = Bud(End)

		var b = a.map(v => v)

		var rs = []
		b.on(value => rs.push(value))

		var s = spy()
		b.on(s)

		state(a, { value: End })
		state(b, { value: End })

		a.emit(1)
		a.emit(2)
		a.emit(3)
		a.emit(4)
		a.emit(End)
		a.emit(5)
		a.emit(End)

		state(a, { value: End })
		state(b, { value: End })

		expect(rs).deep.eq([ End ])
		expect(s.callCount).eq(1)
	})
})
