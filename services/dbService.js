const { database } = require('../services/firebaseService');
const { ref, get } = require('firebase/database');

async function getEventData(eventId) {
  const eventRef = ref(database, `events/${eventId}`);
  const snapshot = await get(eventRef);
  return snapshot.val();
}

async function saveEvaluation(eventId, evaluation) {
  const eventRef = ref(database, `events/${eventId}/evaluation`);
  // TODO: Save the evaluation to the database

  const eventSnapshot = await getEventData(eventId);

  const updated_eval = {
    teacher: eventSnapshot.evaluation.teacher,
    admin: eventSnapshot.evaluation.admin,
    system: evaluation,
  };

  console.log('Saving evaluation to database:', { eventId, updated_eval });
  console.log('Saved');
}

module.exports = { getEventData, saveEvaluation };
