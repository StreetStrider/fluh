
import { Bud } from '.'
import { debug } from '.'

var a = Bud()

a.thru(debug({ depth: 0, label: 'x' }))
a.thru(debug({ depth: 2 }))
a.thru(debug('x', { depth: 2 }))
a.thru(debug())

a.emit(1)
a.emit({ x: 1 })
a.emit([ 1, 2, 3 ])
