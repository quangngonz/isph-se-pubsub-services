const {database} = require('./services/firebaseService');
const {ref, get} = require('firebase/database');

// Loop that runs engine
const engine = async function (time_passed) {
  console.log('____________________');
  console.log('Current time:', new Date().toISOString());
  console.log('I am an engine running the ISPH Stock Exchange');
  console.log('Time passed since last cycle:', time_passed, 'ms');

  const eventWeightsRef = ref(database, `engine_weights`);
  const eventWeightsSnapshot = await get(eventWeightsRef);

  const events = eventWeightsSnapshot.val();

  const Table = require('cli-table3');
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

// Print the table to the terminal
  console.log(table.toString());

  console.log('____________________');

  // TODO: Added Decay function
};

exports.engine = engine;
