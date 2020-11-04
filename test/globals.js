
import { expect } from 'chai'
import { spy } from 'sinon'

import { polyfill as raf } from 'raf'
raf(global)


{
	global.expect = expect
	global.spy = spy
}

{
	let { resolve } = require('path')
	process.env.NODE_PATH = resolve(__dirname, '..')
	// eslint-disable-next-line no-underscore-dangle
	require('module')._initPaths()
}
