const assert = require('assert')
const configs = require('./config')
const { Cmd } = require('./cmd')
const { File } = require('./file')
const { log } = require('./log')
const { SystemProxy } = require('./system_proxy')

const keys = Object.keys(configs)

// for `tool === 'all'`
async function batch(func, clientConfig) {
  const { tool } = clientConfig
  let tools = []

  if (clientConfig.tool === 'all') {
    tools = keys
  } else {
    assert(configs.hasOwnProperty(tool), `invalid tool name: ${tool}`)
    tools = [tool]
  }

  for (let i = 0; i < tools.length; i += 1) {
    const tool = tools[i]

    const config = Object.assign({}, configs[tool], {
      tool,
    })

    const { type = 'cmd' } = config
    const cmd = type === 'system'
      ? new SystemProxy(clientConfig) : new Cmd(config)
    const exist = await cmd.detect()

    if (!exist) {
      log(`"${tool}" not found.`)
      return
    }

    let ops = cmd

    if (type === 'file') {
      ops = new File(config)
    }

    await func(ops, clientConfig)
  }
}

module.exports = {
  batch,
}
