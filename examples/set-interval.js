import { resource } from 'fluh'
import { when_data } from 'fluh/map/when'
import { End } from 'fluh'

function interval (ms) {
	return resource((emit) => {
		console.info('resource initialized')

		let next = 0
		let t = setInterval(() => {
			next++
			emit(next)
		}, ms)

		return function disposer () {
			if (!t) return

			clearInterval(t)

			t = null
			emit = null

			console.info('resource received End and got disposed')
		}
	})
}


const source = interval(50)

source
.map(when_data((x) => x * x - 1))
.on((x) => console.info('+', x))

source
.on((x) => { if (x == 5) source.emit(End) })