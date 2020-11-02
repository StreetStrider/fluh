
import { add } from 'benny'

import { Observable } from 'rxjs'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'


export default
[
	add('diamond (rxjs)', () =>
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
	}),

	add('deep linear (rxjs)', () =>
	{
		var a = new Observable(sub =>
		{
			sub.next(17)
		})

		var n = 1

		var b = a
		for (let n = 0; n < 100; n++)
		{
			b = b.pipe(map(b => b + 1))
		}

		return () =>
		{
			b.subscribe(() => n++)
		}
	}),

	add('triangle in triangle (rxjs)', () =>
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
	}),
]
