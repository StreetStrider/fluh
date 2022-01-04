
import { Bud } from './Bud'

export type Emitter <T> = Bud<T>['emit']
export type TransformerEmit <T, R = T> = (value: T, emit: Emitter<R>) => void

export default function <T, R = T> (bud: Bud<T>, fn: TransformerEmit<T, R>): Bud<R>
