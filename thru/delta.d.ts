
import { Transformer } from '../lib/Bud'

type ProducerDelta <T, R> = (next: T, prev: T) => R

export default function <T, R> (fn?: ProducerDelta<T, R>): Transformer<T, R>
