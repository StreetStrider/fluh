
import Bud from 'lib/Bud'
// import join from 'lib/join'
// import Nothing from 'lib/Nothing'
// import Many from 'lib/Many'
import End from 'lib/End'

describe.only('End', () =>
{
	it('ends and ignores other', () =>
	{
		var a = Bud()

		var b = a.map(v => v)

		var rs = []
		b.on(value => rs.push(value))

		var s = spy()
		b.on(s)

		a.emit(1)
		a.emit(2)
		a.emit(3)
		a.emit(End)
		a.emit(4)

		expect(a.value).eq(End)
		expect(b.value).eq(End)

		expect(rs).deep.eq([ 1, 2, 3, End ])
		expect(s.callCount).eq(4)
	})
})