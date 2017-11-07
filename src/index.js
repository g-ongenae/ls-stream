'use strict'

// Internals dependencies
const { version, description } = require('../package.json')
const stream = require('./stream')
const log = console.log

// Variables
let directory
let waiting_time

const help =
  'Usage: ls-stream <dir> [waiting_time]\n\n' +
  'Params:\n' +
  ' <dir>           the directory to watched required\n' +
  ' [waiting_time]  time before checking the directory again'

if (process.argv.length < 3) {
  console.error('Missing arguments\n' + help)
  process.exit(1)
}

for (let i = 2; i < process.argv.length; i++) {
  switch (process.argv[i]) {
    case '-h':
    case '--help':
      log(help)
      process.exit(0)
      break
    case '--usage':
    case '--description':
      log(description)
      process.exit(0)
      break
    case '-v':
    case '--version':
      log(version)
      process.exit(0)
      break
    default:
      if (!directory) {
        directory = process.argv[i]
      } else if (!waiting_time) {
        const checkValue = parseInt(process.argv[i])
        if (isNaN(checkValue)) {
          console.error('Wrong Params: ' + process.argv[i] + '\n' + help)
          process.exit(1)
        } else {
          waiting_time = checkValue
        }
      } else {
        continue
      }
  }
}

function main(dir, waiting_time) {
  dir.replace('~', process.env.HOME)
  stream(dir, waiting_time)
    .catch((err) => {
      console.error(err)
    })
}

main(directory, waiting_time)
