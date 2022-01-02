
export default function <Args extends any[]> (fn: (...args: Args) => void):
	(...args: Args) => Args[0]
