const yargs = require('yargs')
const cmds = require('./cmds')
const config = require('./config')

// cmds:
// 0. help
// 1. ls [tool]
// 2. activate [tool] value
// 3. deactivate [tool] value
const toolArgDesc = [
  'tool',
  {
    describe: 'tool/cli to be toollied, including:' +
      ` ${['all'].concat(Object.keys(config)).join(', ')}.`,
    type: 'string',
    default: 'all',
  },
]

const proxyArgDesc = [
  'proxy',
  {
    describe: 'Your http-proxy service, e.g. http://127.0.0.1:8080.',
    type: 'string',
  }
]

const useSOCKSDesc = [
  'use-socks', {
    alias: 's',
    demandOption: false,
    describe: 'Setup a http-proxy service by utilizing an existing SOCKS5'
      + ' service, e.g. 127.0.0.1:1080',
    type: 'string',
  }
]

function describeArguments(argsList, options = []) {
  return (yargs) => {
    argsList.forEach(args => yargs.positional(...args))
    options.forEach(option => yargs.option(...option))
  }
}

function extract(argv) {
  const cmd = argv._[0]
  const { tool, proxy } = argv

  return {
    cmd,
    tool,
    proxy,
    useSOCKS: argv.s,
  }
}

function start(argv) {
  const formatArgs = extract(argv)
  const { cmd } = formatArgs

  cmds[cmd](formatArgs)
}

function run() {
  yargs
    .detectLocale(false)
    .command('ls <tool>', 'List the proxy configs of the tools.',
      describeArguments([toolArgDesc]), start)
    .command('set <tool> <proxy>', 'Set proxy configs.',
      describeArguments([toolArgDesc, proxyArgDesc], [useSOCKSDesc]), start)
    .command('unset <tool>', 'Unset the proxy configs of the tools.',
      describeArguments([toolArgDesc]), start)
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv
}

module.exports = {
  run,
}
