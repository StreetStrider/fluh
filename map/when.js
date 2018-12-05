
import Same from '../lib/Same'
import Fin  from '../lib/Fin'


function λwhen (pred, fn_true, fn_false)
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


export default function when (pred, fn_false_default = Same)
{
	return (fn_true, fn_false = fn_false_default) =>
	{
		return λwhen(pred, fn_true, fn_false)
	}
}


import End  from '../lib/End'

export var when_data = when(is_not_end)

export var when_end  = when(is_end)


export var when_data_all = when((...values) => (! values.some(is_end)), Fin)


function is_end (value)
{
	return value === End
}

function is_not_end (value)
{
	return value !== End
}
