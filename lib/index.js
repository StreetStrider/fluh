
import Bud from './Bud'

import { Deps } from './realm'

import join from './join'
import { order } from './join'

// var b = Bud()
// console.log(b)
// b.emit(17)
// console.log(b)

var a = Bud(() => 'a')
var b = join([ a ], (a) => a + 'b')
var c = join([ a, b ], (a, b) => a + b + 'c')
var d = join([ b, c ], (b, c) => b + c)

console.log(d)
console.log('ORDER', order(a))
