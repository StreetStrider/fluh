
import Same from '../lib/Same'
import Noop from '../lib/Noop'

import { base_when } from './when'


export default function filter (pred)
{
	return base_when(pred, Same, Noop)
}


export function filter_by (bud)
{
	return filter(bud.sample)
}
