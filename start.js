
import { Bud }  from '.'
// import { End }  from '.'

import { tap }  from '.'
// import { turnoff } from '.'

// import { when_data } from './map/when'

var a = Bud()
var ds = a.on(label('a'))

console.log(ds)

/*
var
b = a.map(when_data(hundred))
b.on(label('b'))

turnoff(b, a)

b
.emit(100)
.emit(End)

a
.emit(1)
.emit(2)
.emit(3)
// .emit(End)


function hundred (x)
{
	return (x + 100)
}
*/

function label (label)
{
	return tap(v => console.log(label, v))
}
