
import { Bud } from '../lib/Bud'
import { Transformer } from '../lib/Bud'

export function every <T, R> (bud: Bud<T>): Bud<R>

export function last <T, R> (bud: Bud<T>): Bud<R>

export function buffered <T, R> (depth: number): Transformer<T, R>
