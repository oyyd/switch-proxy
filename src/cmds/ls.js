const assert = require('assert')
const { batch } = require('../batch')
const { log } = require('../log')

const ls = (clientConfig) => {
  return batch(async (cmd, clientConfig) => {
    const { tool } = clientConfig
    // TODO
    log(`${tool}:`)
    const res = await cmd.get()
    log(res)
  }, clientConfig)
}

module.exports = {
  ls,
}
