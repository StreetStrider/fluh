/* eslint complexity: [ 2, 6 ] */

import End from '../End'


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
		// TODO: possible clean inv on dependents
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
