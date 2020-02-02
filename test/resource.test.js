
import resource from 'lib/resource'

import End from 'lib/End'
import concat from 'lib/concat'


describe('resource', () =>
{
	it('works', async () =>
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

		var rs = []

		var t = Timer(50)
		.on(v => rs.push(v))
		.on(v => (v === 5) && t.emit(End))

		expect(await concat(t)).deep.eq([ 1, 2, 3, 4, 5, End ])
	})
})
