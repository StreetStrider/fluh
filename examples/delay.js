import { transfer } from 'fluh'
import { Bud } from 'fluh'
import { End } from 'fluh'

function delay (ms = 0) {
	return (bud_source) => {
		return transfer(bud_source, (value, emit) => {
			setTimeout(() => {
				console.info(`bring ${ms}ms delay; graph becomes async`)
				emit(value)
			}, ms)
		})
	}
}

const source = Bud()

source
.on((x) => console.log('sync', x))

source
.thru(delay(16))
.on((x) => console.log('async', x))

source
.emit(1)
.emit(2)
.emit(3)
.emit(4)
.emit(5)
.emit(End)
