const {ref, get} = require("firebase/database");
const {database} = require("../services/firebaseService");
const Table = require("cli-table3");

const getEventWeights = async (log = false) => {
  const eventWeightsRef = ref(database, `engine_weights`);
  const eventWeightsSnapshot = await get(eventWeightsRef);

  const events = eventWeightsSnapshot.val();

  // for (const eventKey in events) {
  //   for (const stockId in events[eventKey]['projection']) {
  //     events[eventKey]['projection'][stockId]['time'] = Math.round(events[eventKey]['projection'][stockId]['time'] * 24 * 60 * 60 * 1000);
  //   }
  // }

  if (log) {
    const table = new Table({
      head: ['Event ID', 'Evaluation', 'Projection'],
      wordWrap: true,
    });

    // Populate the table with formatted data
    for (const eventKey in events) {
      table.push([
        events[eventKey]['event_id'],
        JSON.stringify(events[eventKey]['evaluation'], null, 2), // Pretty JSON
        JSON.stringify(events[eventKey]['projection'], null, 2), // Pretty JSON
      ]);
    }

    console.log(table.toString());
  }

  return events;
}

const getStocks = async (log = false) => {
  // Get stock list from /stocks endpoint
  const stocksRef = ref(database, 'stocks');
  const snapshot = await get(stocksRef);

  if (!snapshot.exists()) {
    return 'Error: No stock list found.';
  }

  if (log) {
    logTable(snapshot);
  }

  return snapshot.val();
}

const logTable = (snapshot) => {
  const table = new Table({
    head: Object.keys(snapshot.val()[Object.keys(snapshot.val())[0]]),
    wordWrap: true,
  });

  // Populate the table with formatted data
  for (const stockKey in snapshot.val()) {
    table.push(Object.values(snapshot.val()[stockKey]));
  }

  console.log("Current Stock Price:");
  console.log(table.toString());
}

module.exports = {getEventWeights, getStocks};
