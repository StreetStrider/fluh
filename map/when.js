

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

export function When (pred, fn_false_default = Same)
{
	return (fn_true, fn_false = fn_false_default) =>
	{
		return base_when(pred, fn_true, fn_false)
	}
}


export var when_data = When(is_data)

export var when_end  = When(is_end)

export var when_error = When(is_error)


export function when_data_all (fn_true)
{
	return (...args) =>
	{
		if (args.some(is_end))
		{
			return End
		}

		var error = args.find(is_error)

		if (error)
		{
			return error
		}

		return fn_true(...args)
	}
}


import End from '../lib/End'

function is_end (value)
{
	return (value === End)
}

function is_error (value)
{
	return (value instanceof Error)
}

function is_data (value)
{
	if (value === End) { return false }
	if (value instanceof Error) { return false }
	return true
}
