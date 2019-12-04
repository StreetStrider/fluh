
import Bud from 'lib/Bud'

import End from 'lib/End'

import join from 'lib/join'


describe('cache', () =>
{
	it('works', () =>
	{
		var a = Bud()

		expect(a.order).deep.eq([])

		var b = join(a, a => a)

		expect(a.order).deep.eq([ b ])
		expect(b.order).deep.eq([])

		var bs = spy()
		b.on(bs)

		a.emit(1)
		expect(bs.callCount).eq(1)

		var c = join(b, b => b)

		expect(a.order).deep.eq([ b, c ])
		expect(b.order).deep.eq([ c ])
		expect(c.order).deep.eq([])

		var cs = spy()
		c.on(cs)

		a.emit(1)

		expect(bs.callCount).eq(2)
		expect(cs.callCount).eq(2)

		var d = join(a, c, (a, c) => a + c)

		expect(a.order).deep.eq([ b, c, d ])
		expect(b.order).deep.eq([ c, d ])
		expect(c.order).deep.eq([ d ])
		expect(d.order).deep.eq([])

		var ds = spy()
		d.on(ds)

		a.emit(1)

		expect(bs.callCount).eq(3)
		expect(cs.callCount).eq(3)
		expect(ds.callCount).eq(2)
	})

	it('behavior on End', () =>
	{
		var a = Bud()

		expect(a.order).deep.eq([])

		var b = join(a, a => a)

		expect(a.order).deep.eq([ b ])
		expect(b.order).deep.eq([])

		var bs = spy()
		b.on(bs)

		a.emit(1)
		expect(bs.callCount).eq(1)

		var c = join(b, b => b)

		expect(a.order).deep.eq([ b, c ])
		expect(b.order).deep.eq([ c ])
		expect(c.order).deep.eq([])

		var cs = spy()
		c.on(cs)

		a.emit(1)

		expect(bs.callCount).eq(2)
		expect(cs.callCount).eq(2)

		b.emit(End)

		expect(bs.callCount).eq(3)
		expect(cs.callCount).eq(3)

		expect(a.order).deep.eq([ b ])
		expect(b.order).deep.eq([])
		expect(c.order).deep.eq([])
	})
})
