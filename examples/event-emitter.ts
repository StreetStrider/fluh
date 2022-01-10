console.info('example: event-emitter')

import { EventEmitter } from 'events'

import { resource } from 'fluh'
import { when_data } from 'fluh/map/when'
import { End } from 'fluh'

const emitter = new EventEmitter
const source = fromEvent<{ x: number }>(emitter, 'click') /* source from EventEmitter */

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

function fromEvent <Event> (emitter: EventEmitter, eventName: string) {
	return resource<Event>((emit) => {
		console.info('resource initialized')

		emitter.addListener(eventName, emit)

		return function disposer () {
			if (!emitter) return

			emitter.removeListener(eventName, emit)

			// @ts-ignore
			emitter = null
			// @ts-ignore
			emit = null

			console.info('resource received End and got disposed')
		}
	})
}
