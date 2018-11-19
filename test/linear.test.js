
import Bud from 'lib/Bud'
import join from 'lib/join'
import Nothing from 'lib/Nothing'

import { expect_bud } from './Bud.test'

describe('linear', () =>
{
	it('A -> B', () =>
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
})
