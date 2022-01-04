
import Bud from 'fluh/lib/Bud'

// import Nothing from 'fluh/lib/Nothing'
import Many from 'fluh/lib/Many'
import End from 'fluh/lib/End'

import join from 'fluh/lib/join'
import merge from 'fluh/lib/merge'

import { state } from './Bud.test'


describe('merge', () =>
{
	it('A ↣ B', () =>
	{
		var a = Bud()

		state(a)

		var b = merge(a)

		state(a,
		{
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			rev: [ a ],
		})

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		a.on(bs1)

		expect(as1.called).false
		expect(bs1.called).false

		a.emit(1)

		var as2 = spy()
		var bs2 = spy()
		a.on(as2)
		a.on(bs2)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 1,
			rev: [ a ],
		})

		expect(as2.callCount).eq(1)
		expect(bs2.callCount).eq(1)

		a.emit(2)

		state(b,
		{
			value: 2,
			rev: [ a ],
		})

		expect(as2.callCount).eq(2)
		expect(bs2.callCount).eq(2)

		a.emit(End)

		state(a, { value: End })
		state(b, { value: End })

		expect(as2.callCount).eq(3)
		expect(bs2.callCount).eq(3)

		a.emit(End)

		state(a, { value: End })
		state(b, { value: End })

		expect(as2.callCount).eq(3)
		expect(bs2.callCount).eq(3)
	})

	it('A(v) ↣ B', () =>
	{
		var a = Bud(1)

		state(a,
		{
			value: 1,
		})

		var b = merge(a)

		state(a,
		{
			value: 1,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 1,
			rev: [ a ],
		})

		a.emit(2)

		state(b,
		{
			value: 2,
			rev: [ a ],
		})
	})

	it('A(emit v) ↣ B', () =>
	{
		var a = Bud()

		a.emit(1)

		var b = merge(a)

		state(b,
		{
			value: 1,
			rev: [ a ],
		})
	})

	it('A(End) ↣ B', () =>
	{
		var a = Bud(End)
		var b = merge(a)

		state(b, { value: End })
	})

	it('A ↣ B(End)', () =>
	{
		var a = Bud()
		var b = merge(a)

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		b.on(bs1)

		b.emit(End)
		a.emit(1)

		state(a, { value: 1 })
		state(b, { value: End })

		expect(as1.callCount).eq(1)
		expect(bs1.callCount).eq(1)

		a.emit(2)

		expect(as1.callCount).eq(2)
		expect(bs1.callCount).eq(1)

		a.emit(End)

		expect(as1.callCount).eq(3)
		expect(bs1.callCount).eq(1)

		state(a, { value: End })
		state(b, { value: End })
	})

	it('A(Many) ↣ B', () =>
	{
		var a = Bud(Many(1, 2))
		var b = merge(a)

		var as1 = spy()
		a.on(as1)

		var bs1 = spy()
		b.on(bs1)

		expect(as1.callCount).eq(1)
		expect(bs1.callCount).eq(1)

		a.emit(Many(3, 4))

		expect(as1.callCount).eq(3)
		expect(bs1.callCount).eq(3)

		state(a,
		{
			value: 4,
			deps:  [ b ],
			order: [ b ],
		})

		state(b,
		{
			value: 4,
			rev: [ a ],
		})
	})

//

	it('A,B ↣ C', () =>
	{
		var a = Bud()
		var b = Bud()

		var c = merge(a, b)

		state(a,
		{
			deps:  [ c ],
			order: [ c ],
		})
		state(b,
		{
			deps:  [ c ],
			order: [ c ],
		})
		state(c,
		{
			rev: [ a, b ],
		})

		a.emit(1)

		state(a,
		{
			value: 1,
			deps:  [ c ],
			order: [ c ],
		})
		state(b,
		{
			deps:  [ c ],
			order: [ c ],
		})
		state(c,
		{
			value: 1,
			rev: [ a, b ],
		})

		a.emit(End)

		state(a, { value: End })
		state(b)
		state(c, { value: End })
	})

	it('A,B,C ↣ D', () =>
	{
		var a = Bud()
		var b = Bud()
		var c = Bud()

		var d = merge(a, b, c)

		state(a,
		{
			deps:  [ d ],
			order: [ d ],
		})
		state(b,
		{
			deps:  [ d ],
			order: [ d ],
		})
		state(c,
		{
			deps:  [ d ],
			order: [ d ],
		})
		state(d,
		{
			rev: [ a, b, c ],
		})

		b.emit(1)

		state(a,
		{
			deps:  [ d ],
			order: [ d ],
		})
		state(b,
		{
			value: 1,
			deps:  [ d ],
			order: [ d ],
		})
		state(c,
		{
			deps:  [ d ],
			order: [ d ],
		})
		state(d,
		{
			value: 1,
			rev: [ a, b, c ],
		})

		a.emit(2)

		state(a,
		{
			value: 2,
			deps:  [ d ],
			order: [ d ],
		})
		state(b,
		{
			value: 1,
			deps:  [ d ],
			order: [ d ],
		})
		state(c,
		{
			deps:  [ d ],
			order: [ d ],
		})
		state(d,
		{
			value: 2,
			rev: [ a, b, c ],
		})
	})

	it('A(v),B ↣ C', () =>
	{
		var a = Bud(1)
		var b = Bud()

		var c = merge(a, b)

		state(a,
		{
			value: 1,
			deps:  [ c ],
			order: [ c ],
		})
		state(b,
		{
			deps:  [ c ],
			order: [ c ],
		})
		state(c,
		{
			value: 1,
			rev: [ a, b ],
		})

		b.emit(2)

		state(a,
		{
			value: 1,
			deps:  [ c ],
			order: [ c ],
		})
		state(b,
		{
			value: 2,
			deps:  [ c ],
			order: [ c ],
		})
		state(c,
		{
			value: 2,
			rev: [ a, b ],
		})
	})

	it('A(v),B(v) ↣ C', () =>
	{
		var a = Bud(1)
		var b = Bud(2)

		var c = merge(a, b)

		var rs = []
		c.on(value => rs.push(value))

		state(a,
		{
			value: 1,
			deps:  [ c ],
			order: [ c ],
		})
		state(b,
		{
			value: 2,
			deps:  [ c ],
			order: [ c ],
		})
		state(c,
		{
			value: 2,
			rev: [ a, b ],
		})

		expect(rs).deep.eq([ 2 ])

		b.emit(3)
		a.emit(4)

		state(a,
		{
			value: 4,
			deps:  [ c ],
			order: [ c ],
		})
		state(b,
		{
			value: 3,
			deps:  [ c ],
			order: [ c ],
		})
		state(c,
		{
			value: 4,
			rev: [ a, b ],
		})

		expect(rs).deep.eq([ 2, 3, 4 ])
	})

	it('A(End),B ↣ C', () =>
	{
		var a = Bud(End)
		var b = Bud()

		var c = merge(a, b)

		state(a, { value: End })
		state(b)
		state(c, { value: End })

		b.emit(1)

		state(a, { value: End })
		state(b, { value: 1 })
		state(c, { value: End })
	})

//

	it('A → B,C ↣ D', () =>
	{
		var a = Bud()

		var b = join(a, a => a * 10)
		var c = join(a, a => a * 100)

		var d = merge(b, c)

		var as = spy()
		a.on(as)
		var ds = spy()
		d.on(ds)

		var rs = []
		d.on(value => rs.push(value))

		expect(as.callCount).eq(0)
		expect(ds.callCount).eq(0)
		expect(rs).deep.eq([])

		state(a,
		{
			deps: [ b, c ],
			order: [ b, c, d ],
		})

		state(b,
		{
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(c,
		{
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(d,
		{
			rev: [ b, c ],
		})

		a.emit(1)

		expect(as.callCount).eq(1)
		expect(ds.callCount).eq(2)
		expect(rs).deep.eq([ 10, 100 ])

		state(a,
		{
			value: 1,
			deps: [ b, c ],
			order: [ b, c, d ],
		})

		state(b,
		{
			value: 10,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(c,
		{
			value: 100,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(d,
		{
			value: 100,
			rev: [ b, c ],
		})

		a.emit(2)

		expect(as.callCount).eq(2)
		expect(ds.callCount).eq(4)
		expect(rs).deep.eq([ 10, 100, 20, 200 ])

		state(a,
		{
			value: 2,
			deps: [ b, c ],
			order: [ b, c, d ],
		})

		state(b,
		{
			value: 20,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(c,
		{
			value: 200,
			rev: [ a ],
			deps: [ d ],
			order: [ d ],
		})

		state(d,
		{
			value: 200,
			rev: [ b, c ],
		})
	})
})
