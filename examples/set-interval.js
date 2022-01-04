console.info('example: set-interval')

import { resource } from 'fluh'
import { when_data } from 'fluh/map/when'
import { End } from 'fluh'

const source = interval(50)

source
.map(when_data((x) => x * x - 1))
.on(console.log)

source
.on((x) => { if (x == 5) source.emit(End) })

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
