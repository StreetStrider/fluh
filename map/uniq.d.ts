
import { Nothing } from '../lib/Nothing'

export default function <T> (): (value: T) => (T | Nothing)
