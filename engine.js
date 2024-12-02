const {database} = require('./services/firebaseService');
const {ref, get} = require('firebase/database');

// Loop that runs engine
const engine = async function () {
  // Log current time
  console.log('Current time:', new Date().toISOString());
  console.log('I am an engine running the ISPH Stock Exchange');

  const eventRef = ref(database, `events`);
  const snapshot = await get(eventRef);

  const events = snapshot.val();

  console.log();
  for (const eventId in events) {
    const event = events[eventId];
    console.log('Event:', event.event_id);
    console.log('\t', event['event_name']);
    console.log('\t', event['event_description']);
    console.log('\t', event.evaluation.system || 'No evaluation');
  }

  console.log('____________________');

  // TODO: Added Decay function
  // TODO: Add probability function for event to occur
};

exports.engine = engine;
