// TODO socks or http_proxy?
const { run } = require('./cmd')
const { log } = require('./log')

const CONFIGS_BY_PLATFORM = {
  'win32': {

  },
  'darwin': {
    cmd: 'networksetup',
    args: {
      get: ['-getsocksfirewallproxy', 'Wi-Fi'],
      set: ['-setsocksfirewallproxy', 'Wi-Fi'],
      // enable: ['-setsocksfirewallproxystate', 'Wi-Fi', 'on'],
      disable: ['-setsocksfirewallproxystate', 'Wi-Fi', 'off'],
    },
  },
}

class SystemProxy {
  constructor(clientConfig) {
    const { useSOCKS } = clientConfig
    this.socks = useSOCKS
    this.shouldRead = true
    this.shouldWrite = Boolean(this.socks)
    this.config = CONFIGS_BY_PLATFORM[process.platform]

    if (!this.config) {
      this.shouldRead = false
      this.shouldWrite = false
      log(`SystemProxy don't support the platform of ${process.platform}`)
    }
  }

  detect() {
    return this.shouldRead || this.shouldWrite
  }

  exec(enable, operator, ...extraArgs) {
    if (!enable) {
      return false
    }

    const { cmd, args } = this.config

    return run(cmd, args[operator].concat(extraArgs))
  }

  get() {
    return this.exec(this.shouldRead, 'get')
  }

  set() {
    const { socks } = this
    let host
    let port
    if (this.shouldWrite) {
      [host, port] = socks.split(':')
    }
    return this.exec(this.shouldWrite, 'set', host, port)
  }

  unset() {
    return this.exec(this.shouldRead, 'disable')
  }
}

module.exports = {
  SystemProxy,
}
