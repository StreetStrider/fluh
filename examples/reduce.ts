console.info('example: reduce')

import { when_data } from 'fluh/map/when'
import reduce from 'fluh/map/reduce'
import { Bud } from 'fluh'
import { End } from 'fluh'

const source = Bud<number | typeof End>()

source
.map(sum()) /* essentially works like a reduce */
.on(console.log)

source
.map(when_data(reduce(0, (a: number, b: number) => a + b))) /* explicit reduce */
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
	return when_data((next: number) => {
		total += next
		return total
	})
}

