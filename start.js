
import Bud  from './lib/Bud'
import join from './lib/join'
import { log } from './lib/realm'

log.enabled = true

var hello = Bud().emit('Hello')
var name = Bud()

var name_c = name.map(name =>
{
	return name[0].toUpperCase() + name.slice(1)
})

var hello_name = join(hello, name_c, (hello, name) =>
{
	return `${ hello }, ${ name }`
})

var hello_name_excl = hello_name.map(s => s + '!')

name.emit('world')
// name.emit('world')

log('*', hello_name_excl.value)
