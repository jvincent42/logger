## Logger JS
Simple JS module for logging things

Use 3 environment variables:
- `USER` : display USER in log entry
- `LOGFILE` : filename to use for log entries, default to *`logs.txt`*
- `DEBUG_LVL` :
  - 0 or undefined : skip all log calls
  - 1 : INFO : displays only *`INFO()`* calls
  - 2 : WARN : displays *`INFO()`* and *`WARN()`* calls
  - 3 : DEBUG : displays *`INFO()`*, *`WARN()`* and *`DEBUG()`* calls

```bash
export LOGFILE=/var/log/myfile.log
export DEBUG_LVL=2 #set log lvl to WARN
```

### API

```javascript
import {
  INFO,     WARN,     DEBUG
  LOG_INFO, LOG_WARN, LOG_DEBUG
} from 'logger'

// log message on stdout
INFO( msg )
WARN( msg )
DEBUG( msg )

// append log to file LOGFILE
LOG_INFO( msg )
LOG_WARN( msg )
LOG_DEBUG( msg )
```

### LICENCE
MIT
