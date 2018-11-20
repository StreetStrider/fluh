
import Bud from 'lib/Bud'
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
		bud.emit(1917)

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
		b1.emit(1917)

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

		a.on(track('a'))
		b.on(track('b'))
		c.on(track('c'))

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
			[ 'a', 17 ],
			[ 'join-b', 17 ],
			[ 'b', 17 ],
			[ 'join-c', 17 ],
			[ 'c', 17 ],
		])
	})

	it('order when additional emits')
})
