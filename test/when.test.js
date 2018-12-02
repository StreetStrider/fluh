
import Nothing from 'lib/Nothing'
import End from 'lib/End'

import when from 'map/when'
import { when_data } from 'map/when'
import { when_end } from 'map/when'

describe('when', () =>
{
	it('when(_)(_, _)', () =>
	{
		var W = when(x => x <= 1)

		expect(W).a('function')
		expect(W.length).eq(1)

		var w = W(x => x * 10 + 1, x => x * 100 + 1)

		expect(w).a('function')
		expect(w.length).eq(1)

		expect(w(0)).eq(1)
		expect(w(1)).eq(11)
		expect(w(2)).eq(201)
		expect(w(3)).eq(301)
	})

	it('when(_)(_)', () =>
	{
		var W = when(x => x <= 1)

		expect(W).a('function')
		expect(W.length).eq(1)

		var w = W(x => x * 10 + 1)

		expect(w).a('function')
		expect(w.length).eq(1)

		expect(w(0)).eq(1)
		expect(w(1)).eq(11)
		expect(w(2)).eq(Nothing)
		expect(w(3)).eq(Nothing)
	})

	it('when_data', () =>
	{
		var w = when_data(x => x * 10 + 1)

		expect(w(0)).eq(1)
		expect(w(1)).eq(11)
		expect(w(End)).eq(Nothing)
	})

	it('when_end', () =>
	{
		var w = when_end(() => 'yes')

		expect(w(0)).eq(Nothing)
		expect(w(1)).eq(Nothing)
		expect(w(End)).eq('yes')
	})
})
