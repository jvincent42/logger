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

const formatNow = (msg, user, lvl) => logType(lvl) + '[' + (new Date()).toUTCString() + '][' + user + '] ' + msg

const printLog = (msg, lvl, code) => {
  if (DEBUG_LVL >= lvl) {
    console.log(colour[code].apply(1, [formatNow(msg, USER, lvl)]))
  }
}

const printErr = (err) => {
  if (err) {
    console.log(err)
  }
}

const appendLog = (msg, lvl) => {
  if (DEBUG_LVL >= lvl) {
    fs.appendFile(LOGFILE, formatNow(msg + '\n', USER, lvl), printErr)
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

/*
 * NetLogger
 */
const net = require('net')

function NetLogger(users) {
  this.users = users
  this.connections = Object.keys(users).reduce((acc, user) => (
    acc[user] = net.connect(...users[user]), acc
  ), {})
}
NetLogger.prototype.INFO = function(username, message) {
  const user = this.connections[username]
  if (!user) return console.log('Error: No such user.')
  user.write(formatNow(message + '\n', username, 1))
}

NetLogger.prototype.stop = function() {
  const connections = this.connections
  Object.keys(connections).forEach(connection => connections[connection].end())
}

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
  NetLogger: NetLogger,
}
