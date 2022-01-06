
import Bud from 'fluh/lib/Bud'

import End from 'fluh/lib/End'

import join from 'fluh/lib/join'

import domain from 'fluh/lib/_/domain'


describe('cache', () =>
{
	it('works', () =>
	{
		var a = Bud()

		expect(domain.comp(a).order).deep.eq([])

		var b = join(a, a => a)

		expect(domain.comp(a).order).deep.eq([ b ])
		expect(domain.comp(b).order).deep.eq([])

		var bs = spy()
		b.on(bs)

		a.emit(1)
		expect(bs.callCount).eq(1)

		var c = join(b, b => b)

		expect(domain.comp(a).order).deep.eq([ b, c ])
		expect(domain.comp(b).order).deep.eq([ c ])
		expect(domain.comp(c).order).deep.eq([])

		var cs = spy()
		c.on(cs)

		a.emit(1)

		expect(bs.callCount).eq(2)
		expect(cs.callCount).eq(2)

		var d = join(a, c, (a, c) => a + c)

		expect(domain.comp(a).order).deep.eq([ b, c, d ])
		expect(domain.comp(b).order).deep.eq([ c, d ])
		expect(domain.comp(c).order).deep.eq([ d ])
		expect(domain.comp(d).order).deep.eq([])

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

		expect(domain.comp(a).order).deep.eq([])

		var b = join(a, a => a)

		expect(domain.comp(a).order).deep.eq([ b ])
		expect(domain.comp(b).order).deep.eq([])

		var bs = spy()
		b.on(bs)

		a.emit(1)
		expect(bs.callCount).eq(1)

		var c = join(b, b => b)

		expect(domain.comp(a).order).deep.eq([ b, c ])
		expect(domain.comp(b).order).deep.eq([ c ])
		expect(domain.comp(c).order).deep.eq([])

		var cs = spy()
		c.on(cs)

		a.emit(1)

		expect(bs.callCount).eq(2)
		expect(cs.callCount).eq(2)

		b.emit(End)

		expect(bs.callCount).eq(3)
		expect(cs.callCount).eq(3)

		expect(domain.comp(a).order).deep.eq([])
		expect(domain.comp(b).order).deep.eq([])
		expect(domain.comp(c).order).deep.eq([])
	})
})
