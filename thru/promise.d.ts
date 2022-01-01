
import { Bud } from '../lib/Bud'
import { Transformer } from '../lib/Bud'

export function every <T, R = T> (bud: Bud<T>): Bud<R>

export function last <T, R = T> (bud: Bud<T>): Bud<R>

export function buffered <T, R = T> (depth: number): Transformer<T, R>
