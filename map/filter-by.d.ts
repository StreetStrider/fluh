
import { Bud } from '../lib/Bud'
import { Nothing } from '../lib/Nothing'

export default function <T> (bud: Bud<boolean>): (value: T) => (T | Nothing)
