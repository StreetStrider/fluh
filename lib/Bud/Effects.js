/* eslint complexity: [ 2, 6 ] */

import def from 'def-prop'
import val from 'def-prop/val'

import Nothing from '../Nothing'
import End from '../End'


export default function Effects (bud)
{
	var fns = null

	function on (fn)
	{
		var value = bud.value

		if (value !== Nothing)
		{
			fn(value)
		}

		if (value === End)
		{
			return disposer_noop()
		}

		if (! fns)
		{
			fns = fn
		}
		else if (typeof fns === 'function')
		{
			fns = [ fns, fn ]
		}
		else
		{
			fns.push(fn)
		}

		return disposer(fn)
	}

	function disposer (fn)
	{
		return function ds ()
		{
			if (! fn) { return }

			if (fns === fn)
			{
				fns = null
			}
			else if (fns)
			{
				var index = fns.indexOf(fn)
				fns = fns.filter((_, fn_index) => (fn_index !== index))

				if (fns.length === 1)
				{
					fns = fns[0]
				}
			}

			fn = null
		}
	}

	def(on, 'emit', val(function emit ()
	{
		if (! fns) { return }

		var value = bud.value

		if (typeof fns === 'function')
		{
			fns(value)
		}
		else
		{
			var fnss = fns
			var i = 0
			var L = fnss.length

			for (; (i < L); i++)
			{
				var fn = fnss[i]

				fn(value)
			}
		}

		if (value === End)
		{
			fns = null
		}
	}))

	return on
}


function disposer_noop ()
{
	return function ds () {}
}
