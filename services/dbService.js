const { database } = require('../services/firebaseService');
const { ref, get, set } = require('firebase/database');

async function getEventData(eventId) {
  const eventRef = ref(database, `events/${eventId}`);
  const snapshot = await get(eventRef);
  return snapshot.val();
}

async function saveEvaluation(eventId, evaluation) {
  const eventRef = ref(database, `events/${eventId}/evaluation`);

  const eventSnapshot = await getEventData(eventId);

  const updated_eval = {
    teacher: eventSnapshot.evaluation.teacher,
    admin: eventSnapshot.evaluation.admin,
    system: evaluation,
  };

  // set processed flag of the event to true
  const eventRefEvaluated = ref(database, `events/${eventId}/evaluated`);
  await set(eventRefEvaluated, true);

  // Save the evaluation to the database
  await set(eventRef, updated_eval);

  console.log('Saving evaluation to database:', { eventId, updated_eval });
  console.log('Saved');
}

async function saveProjection(eventId, projection) {
  const eventRef = ref(database, `events/${eventId}/projection`);

  // Save the projection to the database
  await set(eventRef, projection);

  console.log('Saving projection to database:', { eventId, projection });
  console.log('Saved');
}

module.exports = { getEventData, saveEvaluation, saveProjection };
