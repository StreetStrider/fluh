
import Bud from 'lib/Bud'

import End from 'lib/End'

import join from 'lib/join'

import domain from 'lib/domain'


describe('cache', () =>
{
	it('works', () =>
	{
		var a = Bud()

		expect(domain.order(a)).deep.eq([])

		var b = join(a, a => a)

		expect(domain.order(a)).deep.eq([ b ])
		expect(domain.order(b)).deep.eq([])

		var bs = spy()
		b.on(bs)

		a.emit(1)
		expect(bs.callCount).eq(1)

		var c = join(b, b => b)

		expect(domain.order(a)).deep.eq([ b, c ])
		expect(domain.order(b)).deep.eq([ c ])
		expect(domain.order(c)).deep.eq([])

		var cs = spy()
		c.on(cs)

		a.emit(1)

		expect(bs.callCount).eq(2)
		expect(cs.callCount).eq(2)

		var d = join(a, c, (a, c) => a + c)

		expect(domain.order(a)).deep.eq([ b, c, d ])
		expect(domain.order(b)).deep.eq([ c, d ])
		expect(domain.order(c)).deep.eq([ d ])
		expect(domain.order(d)).deep.eq([])

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

		expect(domain.order(a)).deep.eq([])

		var b = join(a, a => a)

		expect(domain.order(a)).deep.eq([ b ])
		expect(domain.order(b)).deep.eq([])

		var bs = spy()
		b.on(bs)

		a.emit(1)
		expect(bs.callCount).eq(1)

		var c = join(b, b => b)

		expect(domain.order(a)).deep.eq([ b, c ])
		expect(domain.order(b)).deep.eq([ c ])
		expect(domain.order(c)).deep.eq([])

		var cs = spy()
		c.on(cs)

		a.emit(1)

		expect(bs.callCount).eq(2)
		expect(cs.callCount).eq(2)

		b.emit(End)

		expect(bs.callCount).eq(3)
		expect(cs.callCount).eq(3)

		expect(domain.order(a)).deep.eq([])
		expect(domain.order(b)).deep.eq([])
		expect(domain.order(c)).deep.eq([])
	})
})
