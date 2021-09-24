
import { at } from '@most/core'
import { map } from '@most/core'
import { filter } from '@most/core'
import { combine } from '@most/core'
import { merge } from '@most/core'
import { tap } from '@most/core'

import { runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'

import { createAdapter } from '@most/adapter'

export default
{
	diamond ()
	{
		var rs

		var n = 1

		// var A = at(1, 17)
		var [ emit, A ] = createAdapter()

		var b = map(a => a + 1, A)
		var c = map(b => b + 1, b)
		var d = combine((a, c) => a + c + 1, A, c)

		// var run = tap(() => n++, d)
		// /*
		var run = tap(() => { n = n + 1; rs() }, d)
		runEffects(run, newDefaultScheduler())
		//*/

		return () =>
		{
			// return runEffects(run, newDefaultScheduler())

			// /*
			var p = new Promise(rs_new => { rs = rs_new })
			emit(17)
			return p
			//*/
		}
	},

	merge ()
	{
		var n = 1

		var a = at(2, -1)
		var b = at(1, 17)
		var c = merge(a, b)

		var run = tap(() => n++, c)

		return () =>
		{
			runEffects(run, newDefaultScheduler())
		}
	},

	deep_linear ()
	{
		var n = 1

		var a = at(1, 17)

		var b = a
		for (var n = 0; n < 100; n++)
		{
			b = map(b => b + 1, b)
		}

		var run = tap(() => n++, b)

		return () =>
		{
			runEffects(run, newDefaultScheduler())
		}
	},

	triangle_triangle ()
	{
		var n = 1

		var a = at(1, 17)

		var b1 = map(a => a + 1, a)
		var c1 = combine((a, b) => a + b + 1, a, b1)

		var b2 = map(b => b + 1, b1)
		var c2 = combine((b, c) => b + c + 1, b2, c1)

		var run = tap(() => n++, c2)

		return () =>
		{
			runEffects(run, newDefaultScheduler())
		}
	},

	shortcut ()
	{
		var n = 1

		var a = at(1, 17)

		var b = a
		for (var n = 0; n < 100; n++)
		{
			if (n === 10)
			{
				b = filter(() => false, b)
			}
			else
			{
				b = map(b => b + 1, b)
			}
		}

		var run = tap(() => n++, b)

		return () =>
		{
			runEffects(run, newDefaultScheduler())
		}
	},
}
