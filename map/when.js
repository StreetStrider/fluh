
import Noop from '../lib/Noop'


function λwhen (pred, fn_true, fn_false = Noop)
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
	return (fn_true, fn_false = Noop) =>
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
// 
// function when_data_all (fn_true, fn_false = Fin)
// {
// 	return (...values) =>
// 	{
// 		if (values.some(value => value === End))
// 		{
// 			return End
// 		}
// 
// 		return fn(...values)
// 	}
// }
// 
// 
// function Fin ()
// {
// 	return End
// }
