"use strict";

const NOT_IMPLEMENTED_MESSAGE = 'Method not implemented yet';

// Print all entries, across all of the sources, in chronological order.
const validateLogData = (logs) => {
  logs.map((log) => {
    if (log.drained === undefined || log.last === undefined) {
      throw new Error('There is a not valid log'); // ask to project leader business rules for this
    }
  })
};

const addCoordinates = (log, i) => {
  return {...log, ...{ls: log, value: log.pop() || false, position: i, visited: false}};
};

const sortAsc = (a, b) => b.value.date - a.value.date;

const setVisit = (val) => ({...val, ...{visited: true}});

const mergeLog = (logs, log) => {
  if (!logs.length) { return [log]; };

  let max = logs.length;
  let low = 0;
  let mid = Math.floor(max/2);

  while (low < max) {
    try {
      if (Date.parse(logs[mid].value.date) < Date.parse(log.value.date)) {
        max = mid;
      } else {
        low = mid + 1;
      }

    } catch (e) {
      console.log(e);
    }

    mid = Math.floor((low+max)/2);
  }

  return [...logs.slice(0, low), ...[log], ...logs.slice(low)]
};

const init = (logSources, printer) => {
  validateLogData(logSources);
  let logs = logSources.map(addCoordinates).sort(sortAsc);

  while (logs.length) {
    let log = logs.pop();

    if (log.visited) { continue; }

    log = setVisit(log)

    // end of file
    if (!log.value) { continue; }
    printer.print(log.value);

    // get more log from the source
    const nestedLog = logs[log.position] ? logs[log.position].ls.pop() : null;

    // merge into logs array to be printed
    if (nestedLog) {
      logs = mergeLog(logs, addCoordinates({...nestedLog, ...{ value: nestedLog, pop: () => null }}, nestedLog.position));
    }
  }

  printer.done()

  return console.log("Sync sort complete.");
};


module.exports = init;
module.exports.validateLogData = validateLogData;
module.exports.sortAsc = sortAsc;
module.exports.mergeLog = mergeLog;
module.exports.addCoordinates = addCoordinates;
module.exports.setVisit = setVisit;