
import Bud  from './Bud'
import join from './join'
import { log } from './realm'

log.enabled = true

var hello = Bud(() => 'Hello')
var name = Bud()

var name_c = join(name, (name) => name[0].toUpperCase() + name.slice(1))

var hello_name = join(hello, name_c, (hello, name) => `${ hello }, ${ name }`)

var hello_name_excl = join(hello_name, (s) => s + '!')

name.emit('world')

log('*', hello_name_excl.value)
