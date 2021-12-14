import { when_data } from 'fluh/map/when'
import { Bud } from 'fluh'
import { End } from 'fluh'

const source = Bud()

source
.map(sum()) /* essentially works like a reduce */
.on(console.log)

source
.map(reduce((a, b) => a + b, 0)) /* explicit reduce */
.on((x) => console.log(x, '\n'))

source
.emit(1)
.emit(2)
.emit(3)
.emit(4)
.emit(5)
.emit(End)

function sum () {
	let total = 0
	return when_data((next) => {
		total += next
		return total
	})
}

function reduce (fn, total) {
	return when_data((next) => {
		total = fn(total, next)
		return total
	})
}
