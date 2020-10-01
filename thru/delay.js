
import transfer from '../lib/transfer'


export default function delay (ms = 0)
{
	return (bud_source) =>
	{
		return transfer(bud_source, (value, emit) =>
		{
			setTimeout(() =>
			{
				emit(value)
			}
			, ms)
		})
	}
}
