
import { expect } from 'chai'
import { spy } from 'sinon'

import { log } from '../lib/realm'

{
	global.expect = expect
	global.spy = spy

	global.log = log
}

{
	let { resolve } = require('path')
	process.env.NODE_PATH = resolve(__dirname, '..')
	// eslint-disable-next-line no-underscore-dangle
	require('module')._initPaths()
}
