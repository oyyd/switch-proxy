const assert = require('assert')
const childProcess = require('child_process')
const { log } = require('./log')

const OPERATION_KEY = {
  get: 'getConfigCmds',
  set: 'setConfigCmds',
  unset: 'unsetConfigCmds',
}

// ['--http-proxy', 'http://127.0.0.1:8080']
// -> '--http-proxy=http://127.0.0.1:8080'
function getExecCmd(cmdName, options) {
  assert(Array.isArray(options), `invalid options type: ${options}`)
  const opts = options.map(item => {
    if (Array.isArray(item)) {
      assert(item.length === 2, `invalid item length: ${item}`)
      return item.join('=')
    }

    assert(typeof item === 'string')
    return item
  })

  return `${cmdName} ${opts.join(' ')}`
}

function runCmd(cmd) {
  assert(cmd, `invalid cmd: ${cmd}`)

  return new Promise((resolve, reject) => {
    const child = childProcess.exec(cmd)
    let stderrData = ''
    let stdoutData = ''

    child.stderr.on('data', (data) => {
      stderrData += data
    })

    child.stdout.on('data', (data) => {
      stdoutData += data
    })

    child.on('error', (err) => {
      child.kill()
      resolve([false, stderrData.trim()])
    })

    child.on('exit', (code) => {
      resolve([!code, stdoutData.trim()])
    })
  })
}

async function run(cmdName, options) {
  const cmd = getExecCmd(cmdName, options)

  log(`running: ${cmd}`)

  const result = await runCmd(cmd)

  if (!result[0]) {
    log(`failed to run: ${cmd} \n msg: ${result[1]}`)
  }

  return result
}

// TODO
async function detect(cmdName) {
  assert(cmdName, `invalid cmdName: ${cmdName}`)

  const [ exist ] = await runCmd(`${cmdName} --version`)

  return exist
}

class Cmd {
  constructor(config) {
    this.config = config
  }

  detect() {
    const { cmd } = this.config
    return detect(cmd)
  }

  async ops(opKey, ...extraArgs) {
    const { cmd, httpProxyFields, extraFields } = this.config
    const prefixArgs = this.config[OPERATION_KEY[opKey]]
    const result = []

    for (let i = 0; i < httpProxyFields.length; i += 1) {
      const field = httpProxyFields[i]
      const args = prefixArgs.slice().concat([field]).concat(extraArgs)

      const res = await run(cmd, args)
      result.push(res)
    }

    const keys = Object.keys(extraFields || {})

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const value = extraFields[key]
      const args = prefixArgs.slice().concat([key, String(value)])

      const res = await run(cmd, args)
      result.push(res)
    }

    return result
  }

  async get() {
    const res = await this.ops('get')
    return res
  }

  async set(proxy) {
    await this.ops('set', proxy)
  }

  async unset() {
    await this.ops('unset')
  }
}

module.exports = {
  detect,
  getExecCmd,
  run,
  Cmd,
}
