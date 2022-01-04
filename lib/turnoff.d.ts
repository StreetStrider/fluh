
import { Bud } from './Bud'
import { Disposer } from './Bud'

import { End } from './End'

export default function <T, R> (bud: Bud<T | End>, bud_target: Bud<R | End>): Disposer
