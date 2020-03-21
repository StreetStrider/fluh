
var noop = () => void 0

import resource from 'lib/resource'

import End from 'lib/End'
import concat from 'lib/concat'
import { when_data } from 'map/when'
import turnoff from 'lib/turnoff'

import { expect_bud } from './Bud.test'


describe('resource', () =>
{
	function Timer (interval)
	{
		return resource(emit =>
		{
			var n = 0
			var t = setInterval(() =>
			{
				emit(n = (n + 1))
			}
			, interval)

			return () =>
			{
				if (! t) { return }

				clearInterval(t)
				t = null
			}
		})
	}


	it('works', async () =>
	{
		var t = Timer(50)

		t.on(v => (v === 5) && t.emit(End))

		expect(await concat(t)).deep.eq([ 1, 2, 3, 4, 5, End ])
	})

	it('passes args', () =>
	{
		resource((emit, bud) =>
		{
			expect(emit).a('function')
			expect_bud(bud)

			return noop
		})
		.emit(End)
	})

	it('works with turnoff', async () =>
	{
		var t = Timer(50)

		var t2 = t.map(when_data(v => (v * 2)))

		t2.on(v => (v === 10) && t.emit(End))

		turnoff(t2, t)

		var [ rs1, rs2 ] = await Promise.all([ concat(t), concat(t2) ])

		expect(rs1).deep.eq([ 1, 2, 3, 4,  5, End ])
		expect(rs2).deep.eq([ 2, 4, 6, 8, 10, End ])
	})
})
