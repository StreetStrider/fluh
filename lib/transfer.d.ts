
import { Bud } from './Bud'

export type Emitter <T> = Bud<T>['emit']
export type TransformerEmit <T, R> = (value: T, emit: Emitter<R>) => void

export default function <T, R> (bud: Bud<T>, fn: TransformerEmit<T, R>): Bud<R>
