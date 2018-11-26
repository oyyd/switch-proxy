const { SystemProxy } = require('../system_proxy')

describe('SystemProxy', () => {
  describe('SystemProxy.get()', () => {
    if (process.platform === 'darwin') {
      it('should return the proxy settings', (done) => {
        const systemProxy = new SystemProxy({})

        systemProxy.get().then((res) => {
          const [success, msg] = res
          expect(success).toBe(true)
          done()
        })
      })
    }
  })
})
