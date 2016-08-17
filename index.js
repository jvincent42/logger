/*
  Logger API for logging things
*/
const fs = require('fs')
const colour = require('colour')


const DEBUG_LVL = process.env.DEBUG_LVL || 0
const USER = process.env.USER || ''
const LOGFILE = process.env.LOGFILE || 'logs.txt'


const logType = (type) =>
  type == 1 ? 'INFO ' :
  type == 2 ? 'WARN ' :
  type == 3 ? 'DEBUG' :
  ''

const formatNow = (msg, lvl) => logType(lvl) + '[' + (new Date()).toUTCString() + '][' + USER + '] ' + msg

const printLog = (msg, lvl, code) => {
  if (DEBUG_LVL >= lvl) {
    console.log(colour[code].apply(1, [formatNow(msg, lvl)]))
  }
}

const printErr = (err) => {
  if (err) console.log(err)
}

const appendLog = (msg, lvl) => {
  if (DEBUG_LVL >= lvl) {
    fs.appendFile(LOGFILE, formatNow(msg + '\n'), printErr)
  }
}

const INFO = (msg) => printLog(msg, 1, 'blue')
const WARN = (msg) => printLog(msg, 2, 'red')
const DEBUG = (msg) => printLog(msg, 3, 'yellow')

const LOG_INFO = (msg) => appendLog(msg, 1)
const LOG_WARN = (msg) => appendLog(msg, 2)
const LOG_DEBUG = (msg) => appendLog(msg, 3)

module.exports = {
  INFO: INFO,
  WARN: WARN,
  DEBUG: DEBUG,
  LOG_INFO: LOG_INFO,
  LOG_WARN: LOG_WARN,
  LOG_DEBUG: LOG_DEBUG
}
