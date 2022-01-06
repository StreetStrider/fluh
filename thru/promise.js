
import transfer from '../lib/transfer'
import Counter  from '../lib/_/Counter'


export function every (bud_source)
{
	return transfer(bud_source, (promise, emit) =>
	{
		Promise.resolve(promise).then(emit, emit)
	})
}

export function last (bud_source)
{
	var Op = Counter()

	return transfer(bud_source, (promise, emit) =>
	{
		var next = Next()

		Promise.resolve(promise).then(next, next)

		function Next ()
		{
			var op = (Op.next(), Op.current())

			return (value) =>
			{
				if (op !== Op.current()) { return }

				emit(value)
			}
		}
	})
}

export function buffered (depth)
{
	return (bud_source) =>
	{
		var buffer  = []
		var results = {}

		var Op = Counter()

		return transfer(bud_source, (promise, emit) =>
		{
			var next = Next()

			Promise.resolve(promise).then(next, next)

			function Next ()
			{
				var op = (Op.next(), Op.current())

				update(op)

				return (value) =>
				{
					var index = buffer.indexOf(op)
					if (index === -1) { return }

					results[op] = value

					if (index === 0) { flush(emit) }
				}
			}
		})

		function update (op)
		{
			buffer.push(op)

			if (buffer.length > depth)
			{
				var op_stale = buffer.shift()
				delete results[op_stale]
			}
		}

		function flush (emit)
		{
			var op = buffer.shift()
			while (true)
			{
				emit(results[op])
				delete results[op]

				if (! buffer.length) { break }

				op = buffer[0]
				if (! (op in results)) { break }

				buffer.shift()
			}
		}
	}
}
