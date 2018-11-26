function parse(content) {
  return JSON.parse(content || '{}')
}

function stringify(content) {
  return JSON.stringify(content, null, 2)
}

module.exports = {
  parse,
  stringify,
}
