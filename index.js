/*
 * Logger API for logging things
 */
const fs = require('fs')
const colour = require('colour')

/*
 * F Helpers
 */
const identity = x => x

/*
 * Environment setup
 */
const DEBUG_LVL = process.env.DEBUG_LVL || 0
const USER = process.env.USER || ''
const LOGFILE = process.env.LOGFILE || 'logs.txt'

/*
 * Logger helpers
 */
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
  if (err) {
    console.log(err)
  }
}

const appendLog = (msg, lvl) => {
  if (DEBUG_LVL >= lvl) {
    fs.appendFile(LOGFILE, formatNow(msg + '\n', lvl), printErr)
  }
}

/*
  Logger exports
*/
const INFO = (msg) => printLog(msg, 1, 'blue')
const WARN = (msg) => printLog(msg, 2, 'red')
const DEBUG = (msg) => printLog(msg, 3, 'yellow')

const LOG_INFO = (msg) => appendLog(msg, 1)
const LOG_WARN = (msg) => appendLog(msg, 2)
const LOG_DEBUG = (msg) => appendLog(msg, 3)

/*
 * Log API
 */
const getLogs = () => {
  const logFileContent = fs.existsSync(LOGFILE) ? fs.readFileSync(LOGFILE) : undefined
  return logFileContent ? logFileContent.toString().split('\n').filter(identity) : logFileContent
}

const entryIs = (lvl) => (entry) => {
  const matches = entry.match(/(.*?)\[/)
  return matches ? matches[1] === logType(lvl) : false
}

const getLogsOf = (lvl) => {
  const logs = getLogs()
  return logs ? logs.filter(entryIs(lvl)) : []
}

const getInfos = () => getLogsOf(1)
const getWarns = () => getLogsOf(2)
const getDebugs = () => getLogsOf(3)

module.exports = {
  INFO: INFO,
  WARN: WARN,
  DEBUG: DEBUG,
  LOG_INFO: LOG_INFO,
  LOG_WARN: LOG_WARN,
  LOG_DEBUG: LOG_DEBUG,
  getLogs: getLogs,
  getInfos: getInfos,
  getWarns: getWarns,
  getDebugs: getDebugs,
}
