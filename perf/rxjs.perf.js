/* eslint-disable max-statements-per-line */

import { Observable } from 'rxjs'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { filter } from 'rxjs/operators'
import { merge } from 'rxjs/operators'

function Handle ()
{
	var emit
	var source = new Observable(sub =>
	{
		emit = (v) => sub.next(v)
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

		var b = A.pipe(map(a => a + 1))
		var c = b.pipe(map(b => b + 1))
		var d = combineLatest([ A, c ]).pipe(map(([a, c]) => a + c + 1))

		d.subscribe(() => { n = (n + 1); handle.rs() })

		return () =>
		{
			return handle.next(17)
		}
	},

	merge ()
	{
		var n = 1

		var a = new Observable(sub =>
		{
			sub.next(-1)
		})
		var b = new Observable(sub =>
		{
			sub.next(17)
		})
		var c = a.pipe(merge(b))

		return () =>
		{
			c.subscribe(() => n++)
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

		var a = new Observable(sub =>
		{
			sub.next(17)
		})

		var b1 = a.pipe(map(a => a + 1))
		var c1 = combineLatest(a, b1).pipe(map(([a, b]) => a + b + 1))

		var b2 = b1.pipe(map(b => b + 1))
		var c2 = combineLatest(b2, c1).pipe(map(([b, c]) => b + c + 1))

		return () =>
		{
			c2.subscribe(() => n++)
		}
	},

	shortcut ()
	{
		var n = 1

		var a = new Observable(sub =>
		{
			sub.next(17)
		})

		var b = a
		for (var n = 0; n < 100; n++)
		{
			if (n === 10)
			{
				b = b.pipe(filter(() => false))
			}
			else
			{
				b = b.pipe(map(b => b + 1))
			}
		}

		return () =>
		{
			b.subscribe(() => n++)
		}
	},
}
