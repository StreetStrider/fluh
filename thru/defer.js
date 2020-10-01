
import transfer from '../lib/transfer'
import asap from '../lib/asap'


export default function defer (bud_source)
{
	return transfer(bud_source, (value, emit) =>
	{
		asap(() => emit(value))
	})
}
