console.info('example: debugging')

import { Bud } from 'fluh'
import { join } from 'fluh'
import { when_data_all } from 'fluh/map/when'
import { End } from 'fluh'

function identity <T> (x: T) {
	return x
}

const source = Bud()
const a = source.map(identity)
const b = source.map(identity)
const drain = join(a, b, when_data_all((a, b) => [a, b]))

source.debug('source')
a.debug()
b.debug()
drain.debug('drain')

source
.emit('Foo')
.emit('Bar')
.emit(End)
