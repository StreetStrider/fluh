
export default function reduce (memo, reducer)
{
	return (next) =>
	{
		return (memo = reducer(memo, next))
	}
}
