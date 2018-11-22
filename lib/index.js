
// import Bud  from './Bud'
// import join from './join'
import Many from './Many'
import { log } from './realm'

log.enabled = true

var many = Many(1, 2, 3)
var fake = [ 1, 2, 3 ]

console.log(many)
console.log(Many.is(many))
console.log(Array.isArray(many))

console.log(fake)
console.log(Many.is(fake))
console.log(Array.isArray(fake))

