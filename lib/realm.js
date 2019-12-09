/*
  this thing is stateful,
  shall be rewritten in incapsulated manner:

  var R = Realm()
  R.Bud()…
*/


// import Log from './Log/Log'
//
// export var log = Log()


//
import Counter from './Counter'

export var Id = Counter()


//
export var deps_fns = new WeakMap

export var deps_inv = new WeakMap

//
import Queue from './Queue/Queue'

export var queue = Queue({ Id, deps_fns, deps_inv })
