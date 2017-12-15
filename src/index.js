'use strict'

// Internals dependencies
const { version, description } = require('../package.json')
const stream = require('./stream')
const { log, error } = console

// Variables
let directory
let waiting_time

const help =
  'Usage: ls-stream <dir> [waiting_time]\n\n' +
  'Params:\n' +
  ' <dir>           the directory to watched required\n' +
  ' [waiting_time]  time before checking the directory again'

function checkArguments(args) {
  return new Promise((resolve, reject) => {
    if (args.length < 3) {
      return reject('Missing arguments\n' + help)
    }

    for (let i = 2; i < args.length; i++) {
      switch (args[i]) {
        case '-h':
        case '--help':
          return resolve(help)
        case '--usage':
        case '--description':
          return resolve(description)
        case '-v':
        case '--version':
          return resolve(version)
        default:
          if (!directory) {
            directory = args[i]
            if (directory[0] === '~') {
              directory.replace('~', process.env.HOME)
            }
          } else if (!waiting_time) {
            const checkValue = parseInt(args[i], 10)

            if (isNaN(checkValue)) {
              return reject('Wrong Params: ' + args[i] + '\n' + help)
            } else {
              waiting_time = checkValue
            }
          } else {
            return resolve()
          }
      }
    }

    return resolve()
  })
}

checkArguments(process.argv)
  .then((message) => {
    if (message) {
      log(message)
      return Promise.resolve()
    }
    if (directory) {
      stream(directory, waiting_time)
    }
  })
  .catch((err) => {
    error(err)
  })
