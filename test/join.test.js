
import Bud from 'fluh/lib/Bud'
import join from 'fluh/lib/join'

import { state } from './Bud.test'


describe('join', () =>
{
	it('A,B → C', () =>
	{
		var a = Bud()
		var b = Bud()

		var c = join(a, b, (a, b) => a + b)

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
			rev: [ a, b ],
		})

		b.emit(10)
		state(a,
		{
			value: 1,
			deps:  [ c ],
			order: [ c ],
		})
		state(b,
		{
			value: 10,
			deps:  [ c ],
			order: [ c ],
		})
		state(c,
		{
			value: 11,
			rev: [ a, b ],
		})
	})

	it('fn first A,B → C', () =>
	{
		var a = Bud()
		var b = Bud()

		var c = join((a, b) => a + b, a, b)

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
			rev: [ a, b ],
		})

		b.emit(10)
		state(a,
		{
			value: 1,
			deps:  [ c ],
			order: [ c ],
		})
		state(b,
		{
			value: 10,
			deps:  [ c ],
			order: [ c ],
		})
		state(c,
		{
			value: 11,
			rev: [ a, b ],
		})
	})
})
