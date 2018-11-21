
import Bud from 'lib/Bud'
import Nothing from 'lib/Nothing'
import join from 'lib/join'

describe('effects', () =>
{
	it('on Bud', () =>
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

	it('on Bud instant', () =>
	{
		var bud = Bud(() => 17)

		var ok = false

		bud.on((value) => { ok = (value === 17) })

		var s = spy()
		bud.on(s)

		expect(ok).true
		expect(s.callCount).eq(1)
	})

	it('multiple', () =>
	{
		var bud = Bud()

		var rs = []

		bud.on((value) => rs.push([ 1, value ]))
		bud.on((value) => rs.push([ 2, value ]))

		bud.emit(17)
		bud.emit(Nothing)
		bud.emit(1917)
		bud.emit()

		expect(rs).deep.eq(
		[
			[ 1, 17 ],
			[ 2, 17 ],
			[ 1, 1917 ],
			[ 2, 1917 ],
		])
	})

	it('on pull', () =>
	{
		var b1 = Bud()
		var b2 = join(b1, v => v)

		var rs = []

		b2.on((value) => rs.push([ 1, value ]))
		b2.on((value) => rs.push([ 2, value ]))

		b1.emit(17)
		b1.emit(Nothing)
		b1.emit(1917)
		b1.emit()

		expect(rs).deep.eq(
		[
			[ 1, 17 ],
			[ 2, 17 ],
			[ 1, 1917 ],
			[ 2, 1917 ],
		])
	})

	it('order', () =>
	{
		var rs = []

		var a = Bud()
		var b = join(a, track('join-b'))
		var c = join(b, track('join-c'))

		a.on(track('a-1'))
		a.on(track('a-2'))
		b.on(track('b-1'))
		b.on(track('b-2'))
		c.on(track('c-1'))
		c.on(track('c-2'))

		function track (name)
		{
			return (value) =>
			{
				rs.push([ name, value ])

				return value
			}
		}

		a.emit(17)

		expect(rs).deep.eq(
		[
			[ 'a-1', 17 ],
			[ 'a-2', 17 ],
			[ 'join-b', 17 ],
			[ 'b-1', 17 ],
			[ 'b-2', 17 ],
			[ 'join-c', 17 ],
			[ 'c-1', 17 ],
			[ 'c-2', 17 ],
		])
	})

	it('order when additional emits', () =>
	{
		var rs = []

		var a = Bud()

		var b = join(a, track('join-b'))
		var c = join(b, track('join-c'))

		a.on(track('a-1'))
		a.on(track('a-2'))
		b.on(track('b-1'))
		b.on(track('b-2'))

		b.on((value) =>
		{
			if (value === 17)
			{
				b.emit(1917)
			}
		})

		c.on(track('c-1'))
		c.on(track('c-2'))

		function track (name)
		{
			return (value) =>
			{
				rs.push([ name, value ])

				return value
			}
		}

		a.emit(17)

		expect(rs).deep.eq(
		[
			[ 'a-1', 17 ],
			[ 'a-2', 17 ],
			[ 'join-b', 17 ],
			[ 'b-1', 17 ],
			[ 'b-2', 17 ],
			[ 'join-c', 17 ],
			[ 'c-1', 17 ],
			[ 'c-2', 17 ],
			[ 'b-1', 1917 ],
			[ 'b-2', 1917 ],
			[ 'join-c', 1917 ],
			[ 'c-1', 1917 ],
			[ 'c-2', 1917 ],
		])
	})

	it('re-emit on self', () =>
	{
		var rs = []

		var a = Bud()

		a.on((value) =>
		{
			if (value < 5)
			{
				a.emit(value + 1)
			}
		})


		var b = join(a, v => v)

		b.on((value) => rs.push(value))

		a.emit(1)

		expect(rs).deep.eq([ 1, 2, 3, 4, 5 ])
	})

	it('circular re-emit', () =>
	{
		var rs = []

		var a = Bud()
		var b = join(a, v => v)

		b.on((value) =>
		{
			if (value < 5)
			{
				a.emit(value + 1)
			}

			rs.push(value)
		})

		a.emit(1)

		expect(rs).deep.eq([ 1, 2, 3, 4, 5 ])
	})
})
