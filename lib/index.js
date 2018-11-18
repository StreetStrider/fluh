
import Bud  from './Bud'
import join from './join'

var a = Bud(() => 'a')
var b = join([ a ], (a) => a + 'b')
var c = join([ a, b ], (a, b) => a + b + 'c')
var d = join([ b, c ], (b, c) => b + c)

console.log(d)
console.log(a.emit('a'))
