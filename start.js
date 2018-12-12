
import { Bud }  from './'
import { join } from './'
import { End }  from './'

import { when_data } from './map/when'

import { log } from './lib/realm'

// log.enabled = true

var a = Bud()

var b = a.map(v =>
{
	if (v === 0)
	{
		throw new TypeError('zero')
	}

	return (1 / v)
})

b.on(v => console.log('v', v))

a
.emit(1)
.emit(2)
.emit(3)
.emit(0)
