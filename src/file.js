const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')
const mkdirp = require('mkdirp')
const parser = require('./file_parser')

const DEFAULT_PROXY_KEY = 'httpProxyFields'

function replaceEnvVars(filePath, envs) {
  let regex
  if (process.platform === 'win32') {
    // TODO test
    regex = /%([A-Z]+)%/
  } else {
    regex = /\$([A-Z]+)/
  }

  let targetPath = filePath
  let res

  while (res = regex.exec(targetPath)) {
    const env = res[1]
    const value = envs[env]

    assert(value, `environment variable ${env} is not defined`)

    targetPath = targetPath.replace(res[0], value)
  }

  return targetPath
}

// return <string>
function getFileContent(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf8' }, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve('')
        }

        return reject(err)
      }

      resolve(content)
    })
  })
}

function mkdir(filePath) {
  return new Promise((resolve, reject) => {
    const folderPath = path.dirname(filePath)

    mkdirp(folderPath, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

function writeFileContent(filePath, content) {
  return mkdir(filePath).then(() => {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err, content) => {
        if (err) {
          return reject(err)
        }

        resolve(content)
      })
    })
  })
}

function getPathObj(configObj, propPath) {
  assert(propPath.length > 0, `invalid field: ${propPath}`)

  let fields = propPath.split('.')
  fields = fields.slice(0, fields.length - 1)

  const res = configObj
  let cur = res

  fields.forEach((key, index) => {
    cur[key] = cur[key] || {}
    cur = cur[key]
  })

  return cur
}

function getPathProp(configObj, propPath) {
  const obj = getPathObj(configObj, propPath)

  const fields = propPath.split('.')
  const key = fields[fields.length - 1]

  return obj[key]
}

// "http.default.proxy = http://127.0.0.1:8080" ->
// "{ http: { default: { proxy: http://127.0.0.1:8080 }}}"
function setPathObj(configObj, propPath, value) {
  const obj = getPathObj(configObj, propPath)

  const fields = propPath.split('.')
  const key = fields[fields.length - 1]

  if (value === undefined) {
    delete obj[key]
  } else {
    obj[key] = value
  }
}

function getAbsolutePath(configFilePath) {
  const filePath = configFilePath[process.platform]
  assert(filePath, `platform is not supported: ${process.platform}`)
  return replaceEnvVars(filePath, process.env)
}

class File {
  constructor(config) {
    const {
      httpProxyFields,
      configFilePath,
      format,
      extraFields,
    } = config

    this.format = format
    this.absolutePath = getAbsolutePath(configFilePath)
    this.httpProxyFields = httpProxyFields
    this.extraFields = extraFields
  }

  // return [object]
  getConfigObj() {
    return getFileContent(this.absolutePath).then((content) => {
      return parser.parse(this.format, content)
    })
  }

  get() {
    const { httpProxyFields } = this

    return this.getConfigObj().then(configObj => {
      const valueByKeys = {}

      httpProxyFields.forEach(key => {
        // const value = getPathProp(configObj, key)
        const value = configObj[key]
        valueByKeys[key] = value
      })

      return valueByKeys
    })
  }

  write(configObj) {
    return writeFileContent(this.absolutePath,
        parser.stringify(this.format, configObj))
  }

  set(value) {
    assert(value, `invalid value: ${value}`)

    return this.getConfigObj().then(configObj => {
      const fields = this[DEFAULT_PROXY_KEY]

      fields.forEach(key => {
        // setPathObj(configObj, key, value)
        configObj[key] = value
      })

      if (this.extraFields) {
        Object.keys(this.extraFields).forEach(key => {
          const value = this.extraFields[key]
          // setPathObj(configObj, key, value)
          configObj[key] = value
        })
      }

      return this.write(configObj)
    })
  }

  unset() {
    return this.getConfigObj().then(configObj => {
      const fields = this[DEFAULT_PROXY_KEY]

      fields.forEach(key => {
        // setPathObj(configObj, key, undefined)
        configObj[key] = undefined
      })

      if (this.extraFields) {
        Object.keys(this.extraFields).forEach(key => {
          // setPathObj(configObj, key, undefined)
          configObj[key] = undefined
        })
      }

      return this.write(configObj)
    })
  }
}

module.exports = {
  File,
  getFileContent,
  replaceEnvVars,
}
