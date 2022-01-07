
import Bud from 'fluh/lib/Bud'
import Many from 'fluh/lib/Many'
import End from 'fluh/lib/End'
import { when_data } from 'fluh/map/when'

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
			deps:  [ b ],
			order: [ b ],
		})
		state(b,
		{
			rev: [ a ]
		})

		a.emit(1)
		a.emit(2)
		a.emit(3)

		state(a,
		{
			value: 3,
			deps:  [ b ],
			order: [ b ],
		})
		state(b,
		{
			value: 3,
			rev: [ a ]
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

	it('End in map', () =>
	{
		var a = Bud()
		var b = a.map(v => (v > 3) && End || v)

		var rs = []
		b.on(value => rs.push(value))

		state(a,
		{
			deps:  [ b ],
			order: [ b ],
		})
		state(b,
		{
			rev: [ a ]
		})

		a.emit(1)
		a.emit(2)
		a.emit(3)

		state(a,
		{
			value: 3,
			deps:  [ b ],
			order: [ b ],
		})
		state(b,
		{
			value: 3,
			rev: [ a ]
		})

		a.emit(4)

		state(a,
		{
			value: 4,
			deps:  [],
			order: [],
		})
		state(b, { value: End })

		a.emit(5)

		state(a,
		{
			value: 5,
			deps:  [],
			order: [],
		})
		state(b, { value: End })
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
		a.emit(Many(2, 3, End, 4))
		a.emit(5)
		a.emit(Many(6, 7))

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

	it('finalizes correctly if cache is flushed', () =>
	{
		var a1 = Bud()
		var b1 = a1.map(when_data(x => x + 1))

		var a2 = Bud()
		var b2 = a2.map(when_data(x => x + 1))

		a1.emit(1)
		a2.emit(1)

		a1.emit(End)
		a2.emit(End)

		state(a1, { value: End })
		state(b1, { value: End })
		state(a2, { value: End })
		state(b2, { value: End })
	})
})
