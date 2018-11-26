const ini = require('../ini')

const TEST_CONTENT = `
#[http]
#       proxy = http://127.0.0.1:8080
#[http]
#       proxy = socks://127.0.0.1:1080
[http]
        proxy = http://127.0.0.1:8080
        proxys = http://127.0.0.1:8080
[apply]
        whitespace = fix
`

describe('file_parser', () => {
  describe('ini.parse', () => {
    it('should parse config files of type ini', () => {
      const obj = ini.parse(TEST_CONTENT)
      expect(typeof obj).toBe('object')
      expect(obj.http.proxy).toBe('http://127.0.0.1:8080')
      expect(obj.http.proxys).toBe('http://127.0.0.1:8080')
      expect(obj.apply.whitespace).toBe('fix')
    })
  })

  describe('ini.stringify', () => {
    it('should return the string from a ini config object', () => {
      const obj = ini.parse(TEST_CONTENT)
      obj['myKey'] = 'hello'
      obj['myKeyObj'] = {}
      obj['myKeyObj']['key'] = 'hello'
      const str = ini.stringify(obj)
      expect(str).toBe(`myKey=hello

[http]
proxy=http://127.0.0.1:8080
proxys=http://127.0.0.1:8080

[apply]
whitespace=fix

[myKeyObj]
key=hello
`)
    })
  })
})
