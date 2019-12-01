
import Nothing from 'lib/Nothing'
import End from 'lib/End'

import Noop from 'lib/Noop'

import { When } from 'map/when'
import { when_data } from 'map/when'
import { when_end } from 'map/when'
import { when_data_all } from 'map/when'


describe('when', () =>
{
	it('when(_)(_, _)', () =>
	{
		var W = When(x => (x <= 1))

		expect(W).a('function')
		expect(W.length).eq(1)

		var w = W(x => (x * 10 + 1), x => (x * 100 + 1))

		expect(w).a('function')
		expect(w.length).eq(0)

		expect(w(0)).eq(1)
		expect(w(1)).eq(11)
		expect(w(2)).eq(201)
		expect(w(3)).eq(301)
	})

	it('when(_)(_)', () =>
	{
		var W = When(x => (x <= 1))

		expect(W).a('function')
		expect(W.length).eq(1)

		var w = W(x => (x * 10 + 1))

		expect(w).a('function')
		expect(w.length).eq(0)

		expect(w(0)).eq(1)
		expect(w(1)).eq(11)
		expect(w(2)).eq(2)
		expect(w(3)).eq(3)
	})

	it('when_data', () =>
	{
		var e = new Error('x')

		var w = when_data(x => (x * 10 + 1))

		expect(w(0)).eq(1)
		expect(w(1)).eq(11)
		expect(w(End)).eq(End)
		expect(w(e)).eq(e)

		var w = when_data(x => x, Noop)

		expect(w(0)).eq(0)
		expect(w(1)).eq(1)
		expect(w(End)).eq(Nothing)
		expect(w(e)).eq(Nothing)
	})

	it('when_end', () =>
	{
		var w = when_end(() => 'yes')

		expect(w(0)).eq(0)
		expect(w(1)).eq(1)
		expect(w(End)).eq('yes')

		var w = when_end(x => x, Noop)

		expect(w(0)).eq(Nothing)
		expect(w(1)).eq(Nothing)
		expect(w(End)).eq(End)
	})

	it('when_data_all', () =>
	{
		var w = when_data_all((...v) => v.join('/'))

		expect(w(0, 1, 2)).eq('0/1/2')
		expect(w(0, 1)).eq('0/1')
		expect(w(0, End, 2)).eq(End)

		var w = when_data_all((...v) => v.join('/'))

		var E1 = new Error('E1')
		var E2 = new Error('E2')

		expect(w(0, 1, 2)).eq('0/1/2')
		expect(w(0, E1)).eq(E1)

		expect(w(0, End, E1)).eq(End)
		expect(w(0, E1, End)).eq(End)

		expect(w(0, E1, E2)).eq(E1)
		expect(w(End, E1, E2)).eq(End)
	})
})
