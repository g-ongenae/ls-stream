'use strict'

// Externals dependencies
const fs = require('fs')

// Globals
let WAITING_TIME
let DIRECTORY
let log

const main = (directory, time, cb) => {
  return new Promise((resolve) => {
    DIRECTORY = directory
    WAITING_TIME = time || 1000
    log = cb || console.log
    return resolve(changes([]))
  })
  .then((files) => {
    loopChanges(files)
  })
  .catch((err) => {
    return Promise.reject(err)
  })
}

const loopChanges = (oldFiles) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(changes(oldFiles))
    }, WAITING_TIME)
  })
  .then((newFiles) => {
    return loopChanges(newFiles)
  })
  .catch((err) => {
    return Promise.reject(err)
  })
}

const changes = (oldFiles) => {
  return readdir()
    .then((newFiles) => {
      printChanges(oldFiles, newFiles)
      return Promise.resolve(newFiles)
    })
    .catch((err) => {
      return Promise.reject(err)
    })
}

const printChanges = (oldFiles, newFiles) => {
  let createdFiles = newFiles

  // Print deleted files & remove conserved files from a tmp list
  for (let i = 0; i < oldFiles.length; i++) {
    if (!newFiles.includes(oldFiles[i])) {
      log('deleted file: ' + oldFiles[i])
    } else {
      createdFiles = createdFiles.filter((value) => { value !== oldFiles[i] })
    }
  }

  // Print new created files
  for (let j = 0; j < createdFiles.length; j++) {
    log('created file: ' + createdFiles[j])
  }
}

const readdir = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(DIRECTORY, (err, files) => {
      if (err) {
        reject(err)
      }

      resolve(files)
    })
  })
}

exports = module.exports = main
