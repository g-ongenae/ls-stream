'use strict'

// Externals dependencies
const program = require('commander')

// Internals dependencies
const { version, description } = require('../package.json')
const stream = require('./stream')

// Main
program
  .version(version)
  .usage(description)
  .arguments('<dir> [waiting_time]')
  .action((dir, waiting_time) => {
    waiting_time = waiting_time || 1000
    dir.replace('~', process.env.HOME)
    stream(dir, waiting_time)
  })
  .parse(process.argv)
