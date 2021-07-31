
import { Observable } from 'rxjs'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { filter } from 'rxjs/operators'
import { merge } from 'rxjs/operators'


export default
{
	diamond ()
	{
		var n = 1

		var A = new Observable(sub =>
		{
			sub.next(17)
		})

		var b = A.pipe(map(a => a + 1))
		var c = b.pipe(map(b => b + 1))
		var d = combineLatest(A, c).pipe(map(([a, c]) => a + c + 1))

		return () =>
		{
			d.subscribe(() => n++)
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

		var a = new Observable(sub =>
		{
			sub.next(17)
		})

		var b = a
		for (var n = 0; n < 100; n++)
		{
			b = b.pipe(map(b => b + 1))
		}

		return () =>
		{
			b.subscribe(() => n++)
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
