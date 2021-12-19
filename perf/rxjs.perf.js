/* eslint-disable max-statements-per-line */

import { Observable } from 'rxjs'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { filter } from 'rxjs/operators'
import { merge } from 'rxjs/operators'

function Handle ()
{
	var emits = new Set
	var source = new Observable(sub =>
	{
		var emit = (v) => sub.next(v)
		emits.add(emit)
		return () => emits.delete(emit)
	})

	var handle =
	{
		rs: null,
		source,
		next,
	}

	function next (value)
	{
		var p = new Promise(rs => { handle.rs = rs })
		emits.forEach(emit => emit(value))
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

		var b = A.pipe(map(a => a + 1))
		var c = b.pipe(map(b => b + 1))
		var d = combineLatest(A, c).pipe(map(([A, c]) => A + c + 1))

		d.subscribe(() => { n = (n + 1); handle.rs() })

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

		var c = a.pipe(merge(b))

		c.subscribe(x => { n = (n + 1); if (x % 2) h1.rs(); else h2.rs() })

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

		var b = handle.source
		for (var n = 0; n < 100; n++)
		{
			b = b.pipe(map(b => b + 1))
		}

		b.subscribe(() => { n = (n + 1); handle.rs() })

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

		var b1 = a.pipe(map(a => a + 1))
		var c1 = combineLatest(a, b1).pipe(map(([a, b]) => a + b + 1))

		var b2 = b1.pipe(map(b => b + 1))
		var c2 = combineLatest(b2, c1).pipe(map(([b, c]) => b + c + 1))

		c2.subscribe(() => { n = (n + 1); handle.rs() })

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
				b.subscribe(b => ((b % 2) || handle.rs()))
				b = b.pipe(filter(b => Boolean(b % 2)))
			}
			else
			{
				b = b.pipe(map(b => b + 1))
			}
		}

		b.subscribe(() => { n = (n + 1); handle.rs() })

		return async () =>
		{
			await handle.next(18)
			await handle.next(17)
		}
	},
}
