/* global requestAnimationFrame */

var raf = requestAnimationFrame

import transfer from '../lib/transfer'


export default function defer (bud_source)
{
	return transfer(bud_source, (value, emit) =>
	{
		raf(() => emit(value))
	})
}
