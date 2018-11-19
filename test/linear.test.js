
import Bud from 'lib/Bud'
import join from 'lib/join'
import Nothing from 'lib/Nothing'

import { expect_bud } from './Bud.test'

describe('linear', () =>
{
	it('A → B', () =>
	{
		var a = Bud()

		var b = join([ a ], a => a + 1)

		expect_bud(b)

		expect(a.value).eq(Nothing)
		expect(b.value).eq(Nothing)

		a.emit(1)

		expect(a.value).eq(1)
		expect(b.value).eq(2)
	})

	it('A(v) → B', () =>
	{
		var a = Bud(() => 1)

		var b = join([ a ], a => a + 1)

		expect(a.value).eq(1)
		expect(b.value).eq(2)
	})

	it('A → B → C', () =>
	{
		var a = Bud()

		var b = join([ a ], a => a + 1)
		var c = join([ b ], b => b * 100)

		expect_bud(b)
		expect_bud(c)

		expect(a.value).eq(Nothing)
		expect(b.value).eq(Nothing)
		expect(c.value).eq(Nothing)

		a.emit(1)

		expect(a.value).eq(1)
		expect(b.value).eq(2)
		expect(c.value).eq(200)
	})

	it('A(v) → B → C', () =>
	{
		var a = Bud(() => 1)

		var b = join([ a ], a => a + 1)
		var c = join([ b ], b => b * 100)

		expect(a.value).eq(1)
		expect(b.value).eq(2)
		expect(c.value).eq(200)
	})
})
