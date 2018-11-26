const iniParser = require('ini')

function parse(content) {
  return iniParser.parse(content)
}

function stringify(content) {
  return iniParser.stringify(content)
}

module.exports = {
  parse,
  stringify,
}
