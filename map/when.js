
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

export var when_data = when(is_not_end)

export var when_end  = when(is_end)


// export var when_data_all = when((...values) =>
// {
// 	return values.some(is_end)
// })

export function when_data_all (fn_true, fn_false = Fin)
{
	return (...values) =>
	{
		if (values.some(is_end))
		{
			return fn_false(...values)
		}

		return fn_true(...values)
	}
}


function is_end (value)
{
	return value === End
}

function is_not_end (value)
{
	return value !== End
}
