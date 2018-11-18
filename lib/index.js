
import Bud  from './Bud'
import join from './join'
import log  from './log'

var a = Bud(() => 'a')
var b = join([ a ], (a) => a + 'b')
var c = join([ a, b ], (a, b) => a + b + 'c')
var d = join([ b, c ], (b, c) => b + c)

log(d)
log(a.emit('a'))
