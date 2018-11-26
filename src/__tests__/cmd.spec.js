const { run, getExecCmd, detect } = require('../cmd')

describe('cmd', () => {
  describe('cmd.detect()', () => {
    it('should return true as we have node executable', (done) => {
      detect('node').then((hasNode) => {
        expect(hasNode).toBe(true)
        done()
      })
    })

    it('should return false the tool doesn\'t exist', done => {
      detect('somethingNotExist').then((has) => {
        expect(has).toBe(false)
        done()
      })
    })
  })

  describe('cmd.getExecCmd()', () => {
    it('should return the cmd to be executed', () => {
      expect(getExecCmd('node', ['-v'])).toBe('node -v')
      expect(getExecCmd('node', [['--http-proxy', 'http://127.0.0.1'], '-v']))
        .toBe('node --http-proxy=http://127.0.0.1 -v')
    })
  })

  describe('cmd.run()', () => {
    it('should return the version of node', (done) => {
      run('node', ['-v']).then(res => {
        const [success, msg] = res
        expect(success).toBe(true)
        expect(/^v[\d\.]+/.test(msg)).toBe(true)
        done()
      })
    })
  })
})
