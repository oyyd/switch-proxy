const assert = require('assert')
const { batch } = require('../batch')
const config = require('../config')
const { Cmd } = require('../cmd')

const unset = (clientConfig) => {
  return batch((cmd) => cmd.unset(), clientConfig)
}

module.exports = {
  unset,
}
