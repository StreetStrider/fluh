console.info('example: cycle')

import { Bud } from 'fluh'
import filter from 'fluh/map/filter'

const init = Bud<number>()
const next = init.map(n => n + 1)

/* it is possible to have a cycle, but exit condition should also present */
next.map(filter(n => n < 10)).on(init.emit)

next.on(n => console.log('next', n))

/* start the cycle */
init.emit(0)
