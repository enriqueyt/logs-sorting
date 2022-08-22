"use strict";

const NOT_IMPLEMENTED_MESSAGE = 'Method not implemented yet';

// Print all entries, across all of the sources, in chronological order.
const validateLogData = (logs) => {
  logs.map((log) => {
    if (!log.drained || !log.last) {
      throw new Error('There is a not valid log'); // ask to project leader bussiness rules for this
    }
  })
};

const addCoordinates = (log, i) => ({...log, ...{value: log.pop(), position: i, visited: false}});

const sorAsc = (a, b) => {
  throw new Error(NOT_IMPLEMENTED_MESSAGE);
};

const mergeLog = () => {
  throw new Error(NOT_IMPLEMENTED_MESSAGE);
};


const init = (logSources, printer) => {
  return console.log("Sync sort complete.");
};


module.exports = init;
module.exports.validateLogData = validateLogData;
module.exports.sorAsc = sorAsc;
module.exports.mergeLog = mergeLog;
module.exports.addCoordinates = addCoordinates;