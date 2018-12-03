
import Same from '../lib/Same'
import Fin  from '../lib/Fin'


function λwhen (pred, fn_true, fn_false = Same)
{
	return (value) =>
	{
		if (pred(value))
		{
			return fn_true(value)
		}
		else
		{
			return fn_false(value)
		}
	}
}


export default function when (pred)
{
	return (fn_true, fn_false = Same) =>
	{
		return λwhen(pred, fn_true, fn_false)
	}
}


import End  from '../lib/End'

export var when_data = when(value => value !== End)

export var when_end  = when(value => value === End)


// export var when_data_all = when((...values) =>
// {
// 	return values.some(value => value === End)
// })

export function when_data_all (fn_true, fn_false = Fin)
{
	return (...values) =>
	{
		if (values.some(value => value === End))
		{
			return fn_false(...values)
		}

		return fn_true(...values)
	}
}
