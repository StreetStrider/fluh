
export default function asap (fn)
{
	return Promise.resolve().then(fn)
}
