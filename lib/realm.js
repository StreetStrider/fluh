/*
  this thing is stateful,
  shall be rewritten in incapsulated manner:

  var R = Realm()
  R.Bud()…
*/


import Log from './log'

export var log = Log()


var next = 1

export function Next ()
{
	return `#${ next++ }`
}

export function Current ()
{
	return next
}


import Queue from './Queue'

export var queue = Queue({ log })
