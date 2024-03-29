
import { Bud } from './Bud'
import { End } from './End'
import { Disposer } from './Bud'

export type Emitter <T> = (emit: Bud<T>['emit'], bud: Bud<T>) => Disposer

export default function <T> (fn: Emitter<T>): Bud<T | End>
