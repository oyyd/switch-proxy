const fs = require('fs')
const path = require('path')

async function createTempFolder() {
  const folderPath = path.resolve(__dirname, './tmp')

  try {
    fs.mkdirSync(folderPath)
  } catch (e) {
    //
  }

  return folderPath
}

async function createFile(name, content) {
  const folderPath = await createTempFolder()
  const filePath = path.resolve(folderPath, name)

  fs.writeFileSync(filePath, content)

  return filePath
}

module.exports = {
  createFile,
}
