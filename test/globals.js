
import { expect } from 'chai'
import { spy } from 'sinon'
global.expect = expect
global.spy = spy

import { polyfill as raf } from 'raf'
raf(global)
