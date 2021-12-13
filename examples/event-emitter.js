import { EventEmitter } from 'events'

import { resource } from 'fluh'
import { when_data } from 'fluh/map/when'
import { End } from 'fluh'

function fromEvent (emitter, eventName) {
	return resource((emit) => {
		console.info('resource initialized')

		emitter.addListener(eventName, emit)

		return function disposer () {
			if (!emitter) return

			emitter.removeListener(eventName, emit)

			emitter = null
			emit = null

			console.info('resource received End and got disposed')
		}
	})
}


const emitter = new EventEmitter
const source = fromEvent(emitter, 'click')

source
.on(console.log)

source
.on(when_data((e) => { if (e.x == 5) source.emit(End) }))

emitter.emit('click', { x: 1 })
emitter.emit('click', { x: 2 })
emitter.emit('click', { x: 3 })
emitter.emit('click', { x: 4 })
emitter.emit('click', { x: 5 })

console.info('listeners:', emitter.listeners('click'))
