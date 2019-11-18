

export function base_when (pred, fn_true, fn_false)
{
	return (...args) =>
	{
		if (pred(...args))
		{
			return fn_true(...args)
		}
		else
		{
			return fn_false(...args)
		}
	}
}


import Same from '../lib/Same'

export default function when (pred, fn_false_default = Same)
{
	return (fn_true, fn_false = fn_false_default) =>
	{
		return base_when(pred, fn_true, fn_false)
	}
}


import Fin  from '../lib/Fin'

export var when_data = when(is_data)

export var when_end  = when(is_end)


export var when_data_all = when((...values) => (! values.some(is_end)), Fin)


import End  from '../lib/End'

function is_end (value)
{
	return value === End
}

function is_data (value)
{
	if (value === End) { return false }
	if (value instanceof Error) { return false }
	return true
}
