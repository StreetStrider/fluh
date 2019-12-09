/* eslint complexity: [ 2, 6 ] */

import Nothing from '../Nothing'
import Many from '../Many'
import End from '../End'


export function propagate (queue, bud, value)
{
	if (bud.value === End)
	{
		return false
	}

	if (! Many.is(value))
	{
		return update_first(queue, bud, value)
	}


	const L = value.length
	let been_updated = false

	for (let n = 0; (n < L); n++)
	{
		if (! been_updated)
		{
			been_updated = update_first(queue, bud, value[n])
		}
		else
		{
			bud.emit(value[n])
		}
	}

	return been_updated
}

function update_first (queue, bud, value)
{
	if (value === Nothing)
	{
		return false
	}

	bud.value = value

	/* bud.on.emit() */

	queue.touch(bud)

	return true
}


export function effects (queue, bud)
{
	if (queue.touched_now(bud))
	{
		bud.on.emit()
	}
}


export function finalize (queue, bud)
{
	if (bud.value !== End) { return false }

	finalize_straight(bud)
	finalize_inverse(queue, bud)

	return true
}

function finalize_straight (bud)
{
	const { deps } = bud

	if (deps.length)
	{
		deps.splice(0)
	}
}

function finalize_inverse (queue, bud)
{
	const inv = queue.invs_finalize(bud)

	if (inv && inv.length)
	{
		const L = inv.length

		for (let n = 0; (n < L); n++)
		{
			const deps_inv_deps = inv[n].deps

			if (! deps_inv_deps.length) { continue }

			const index = deps_inv_deps.indexOf(bud)

			if (~ index)
			{
				deps_inv_deps.splice(index, 1)
			}
		}

		/* inv.splice(0) */
	}
}
