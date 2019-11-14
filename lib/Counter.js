

export default function Counter ()
{
	var value = 1

	return 0,
	{
		current ()
		{
			return value
		},
		next ()
		{
			return value++
		},
	}
}
