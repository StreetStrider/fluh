
import { expect } from 'chai'

{
	global.expect = expect
}

{
	let { resolve } = require('path')
	process.env.NODE_PATH = resolve(__dirname, '../..')
	// eslint-disable-next-line no-underscore-dangle
	require('module')._initPaths()
}
