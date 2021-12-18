/* eslint-disable max-statements-per-line */

import { map } from '@most/core'
import { filter } from '@most/core'
import { combine } from '@most/core'
import { merge } from '@most/core'
import { tap } from '@most/core'

import { runEffects } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'

import { createAdapter } from '@most/adapter'

function Handle ()
{
	var [ emit, source ] = createAdapter()
	var handle =
	{
		rs: null,
		source,
		next,
	}

	function next (value)
	{
		var p = new Promise(rs => { handle.rs = rs })
		emit(value)
		return p
	}

	return handle
}


export default
{
	diamond ()
	{
		var n = 1

		var handle = Handle()
		var A = handle.source

		var b = map(a => a + 1, A)
		var c = map(b => b + 1, b)
		var d = combine((a, c) => a + c + 1, A, c)

		var run = tap(() => { n = (n + 1); handle.rs() }, d)
		runEffects(run, newDefaultScheduler())

		return () =>
		{
			return handle.next(17)
		}
	},

	merge ()
	{
		var n = 1

		var h1 = Handle()
		var a = h1.source

		var h2 = Handle()
		var b = h2.source

		var c = merge(a, b)

		var run = tap(x => { n = (n + 1); if (x % 2) h1.rs(); else h2.rs() }, c)
		runEffects(run, newDefaultScheduler())

		return async () =>
		{
			await h1.next(17)
			await h2.next(18)
		}
	},

	deep_linear ()
	{
		var n = 1

		var handle = Handle()
		var a = handle.source

		var b = a
		for (var N = 0; N < 100; N++)
		{
			b = map(b => b + 1, b)
		}

		var run = tap(() => { n = (n + 1); handle.rs() }, b)
		runEffects(run, newDefaultScheduler())

		return () =>
		{
			return handle.next(17)
		}
	},

	triangle_triangle ()
	{
		var n = 1

		var handle = Handle()
		var a = handle.source

		var b1 = map(a => a + 1, a)
		var c1 = combine((a, b) => a + b + 1, a, b1)

		var b2 = map(b => b + 1, b1)
		var c2 = combine((b, c) => b + c + 1, b2, c1)

		var run = tap(() => { n = (n + 1); handle.rs() }, c2)
		runEffects(run, newDefaultScheduler())

		return () =>
		{
			return handle.next(17)
		}
	},

	shortcut ()
	{
		var n = 1

		var handle = Handle()

		var b = handle.source
		for (var N = 0; N < 100; N++)
		{
			if (N === 10)
			{
				var run1 = tap(b => ((b % 2) || handle.rs()), b)
				b = filter(b => Boolean(b % 2), b)
			}
			else
			{
				b = map(b => b + 1, b)
			}
		}

		var run2 = tap(() => { n = (n + 1); handle.rs() }, b)

		runEffects(run1, newDefaultScheduler())
		runEffects(run2, newDefaultScheduler())

		return async () =>
		{
			await handle.next(18)
			await handle.next(17)
		}
	},
}
