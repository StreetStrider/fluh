
import { Bud }  from './'
import { join } from './'
import { End }  from './'

import capture from './lib/capture'
import { when_data } from './map/when'

import { log } from './lib/realm'

// log.enabled = true

var a = Bud()

var b = a.map(capture(v =>
{
	if (v === 0)
	{
		throw new TypeError('zero')
	}

	return (1 / v)
}))

b.on(v => console.log('v', v))
b.on(when_data(v => console.log('d', v)))

a
.emit(0)
.emit(1)
.emit(2)
.emit(3)
