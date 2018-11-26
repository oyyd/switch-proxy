const fs = require('fs')
const path = require('path')
const { getFileContent, replaceEnvVars } = require('../file')
const { createFile } = require('./utils')

describe('file', () => {
  describe('getFileContent()', () => {
    it('should return \'\' if the config file doesn\'t exist', (done) => {
      const p = path.resolve(__dirname, './config')

      getFileContent(p).then(file => {
        expect(file).toBe('')
        done()
      })
    })

    it('should return object if the config file doesn\'t exist', (done) => {
      const content = '{hello: "world"}'
      createFile('config', content).then((filePath) => {
        getFileContent(filePath).then(file => {
          expect(file).toBe(content)
          done()
        })
      })
    })
  })

  describe('replaceEnvVars', () => {
    if (process.platform !== 'win32') {
      it('should return the absolute file path', () => {
        const envs = {
          'HOME': '/User/oyyd',
        }
        expect(replaceEnvVars('$HOME/config', envs)).toBe('/User/oyyd/config')
      })
    }
  })
})
