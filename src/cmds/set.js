const assert = require('assert')
const { URL } = require('url')
const { createServer } = require('http-proxy-to-socks')
const { batch } = require('../batch')

async function setFile(cmd, clientConfig) {
  const { proxy } = clientConfig
  await cmd.set(proxy)
}

async function set(clientConfig) {
  const { proxy, useSOCKS } = clientConfig
  const url = new URL(proxy)

  await batch(setFile, clientConfig)

  const { port } = url

  if (useSOCKS) {
    createServer({
      socks: useSOCKS,
      port,
      level: 'verbose',
      host: '0.0.0.0',
    })
  }
}

module.exports = {
  set,
}
