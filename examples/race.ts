console.info('example: race')

import { Bud } from 'fluh'
import { Bud as T_Bud } from 'fluh/lib/Bud'

import transfer from 'fluh/lib/transfer'

import { every } from 'fluh/thru/promise'
import { last } from 'fluh/thru/promise'
import { buffered } from 'fluh/thru/promise'

function delay (bud: T_Bud<number>) {
	return transfer(bud, (value, emit) => {
		const timeout = (10 - value)
		emit(new Promise(rs => {
			setTimeout(() => rs(value), (timeout * 25))
		}))
	})
}

const source = Bud<number>()
const delayed = source.thru(delay)

const delayed_every = delayed.thru(every)
const delayed_last = delayed.thru(last)
const delayed_buffered = delayed.thru(buffered(3))

delayed_every.on(n =>    console.log('   EVERY', n))
delayed_last.on(n =>     console.log('    LAST', n))
delayed_buffered.on(n => console.log('BUFFERED', n))

source
.emit(1)
.emit(2)
.emit(3)
.emit(4)
.emit(5)
.emit(6)
.emit(7)
.emit(8)
.emit(9)
