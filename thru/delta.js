
import Same from '../lib/Same'

import transfer from '../lib/transfer'


export default function delta (fn = Same)
{
	return (bud_source) =>
	{
		var prev = bud_source.value

		return transfer(bud_source, (next, emit) =>
		{
			try
			{
				emit(fn(prev, next))
			}
			finally
			{
				prev = next
			}
		})
	}
}
