const { database } = require('./services/firebaseService');
const { ref, get } = require('firebase/database');

// Create a loop that runs every 1000 milliseconds
setInterval(async function () {
  //log current time
  console.log('Current time:', new Date().toISOString());

  const eventRef = ref(database, `events`);
  const snapshot = await get(eventRef);
  const events = snapshot.val();

  for (const eventId in events) {
    const event = events[eventId];
    console.log('Event:', event.event_id);
    console.log(event.event_description);
    console.log('____________________');
  }

  console.log('I am an engine running the ISPH Stock Exchange');
}, 5000);
