
import { Bud }  from './'
import { join } from './'
import { End }  from './'

import { log } from './lib/realm'

log.enabled = true

var hello = Bud().emit('Hello')
var name  = Bud()

var name_c = name.map(when_data(name =>
{
	return name[0].toUpperCase() + name.slice(1)
}))

var hello_name = join(hello, name_c, when_data_all((hello, name) =>
{
	return `${ hello }, ${ name }`
}))

var hello_name_excl = hello_name.map(when_data(s => s + '!'))

hello_name_excl.on(value => console.log('*', value))


name.emit('world')
name.emit(End)


function when_data (fn)
{
	return (value) =>
	{
		if (value !== End)
		{
			return fn(value)
		}
		else
		{
			return value
		}
	}
}

function when_data_all (fn)
{
	return (...values) =>
	{
		if (values.some(value => value === End))
		{
			return End
		}

		return fn(...values)
	}
}
