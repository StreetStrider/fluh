

export default function tap (fn)
{
	return (...args) => (fn(...args), args[0])
}
