"use strict";

const { setVisit, mergeLog } = require("./sync-sorted-merge");

// Print all entries, across all of the *async* sources, in chronological order.
const addCoordinatesAsync = async (log, i) => {
  const value = await log.popAsync();
  return {...log, ...{ls: log, value: value || false, position: i, visited: false}};
};


const init = async (logSources, printer) => {
  const logs = await Promise.all(logSources.map(addCoordinatesAsync));
  let logsSorted = logs.sort((a, b) => b.value.date - a.value.date);

  while (logsSorted.length) {
    let log = logsSorted.pop();

    if (log.visited) { continue; }

    log = setVisit(log)

    // end of file
    if (!log.value) { continue; }
    printer.print(log.value);

    // get more log from the source
    let nestedLog = null;
    if (logsSorted[log.position]) {
      nestedLog = await logsSorted[log.position].ls.popAsync()
    }

    // merge into logs array to be printed
    if (nestedLog) {
      const newLog = await addCoordinatesAsync({...nestedLog, ...{ value: nestedLog, popAsync: () => null }}, nestedLog.position);
      logsSorted = mergeLog(logsSorted, newLog);
    }
  }

  printer.done()

  console.log("Async sort complete.");
};


module.exports = init;
