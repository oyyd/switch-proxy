const ini = require('./ini')
const json = require('./json')

const parsers = {
  ini,
  json,
}

function getParser(format) {
  if (!parsers.hasOwnProperty(format)) {
    throw new Error(`invalid format: ${format}`)
  }

  return parsers[format]
}

function parse(format, content) {
  const parser = getParser(format)
  return parser.parse(content)
}

function stringify(format, content) {
  const parser = getParser(format)
  return parser.stringify(content)
}

module.exports = {
  parse,
  stringify,
}
