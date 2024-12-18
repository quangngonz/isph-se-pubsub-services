const {database} = require('../services/firebaseService');
const {ref, get, set} = require('firebase/database');
const {v4: uuidv4} = require('uuid');

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

  console.log('Saving evaluation to database:', {eventId, updated_eval});
  console.log('Saved');
}

async function saveProjection(eventId, projection) {
  const eventRef = ref(database, `events/${eventId}/projection`);

  // Save the projection to the database
  await set(eventRef, projection);

  console.log('Saving projection to database:', {eventId, projection});
  console.log('Saved');
}

async function updateEventStatus(eventId, status) {
  console.log('____________________');
  console.log('Updating event status:', {eventId, status});
  const eventData = await getEventData(eventId);
  const adminApproved = eventData['approved'];

  const evaluationRef = ref(database, `events/${eventId}/evaluated`);
  const snapshot = await get(evaluationRef);
  await set(evaluationRef, true);

  console.log('Event evaluated:', {eventId, evaluated: snapshot.val()});
  console.log('Admin approved:', adminApproved);

  if (adminApproved) {
    // Push to EngineWeights
    // Create table first
    const engineWeightsRef = ref(database, `engine_weights/${eventId}`);

    const data = {
      event_id: eventId,
      projection: eventData['projection'],
      evaluation: eventData['evaluation']['system'],
    }

    await set(engineWeightsRef, data);
  }

  console.log('Saving status to database:', {eventId, status});
  console.log('Saved');
  console.log('____________________');
}

const logOldPrice = async (stock) => {
  const oldStockPrice = await get(ref(database, `stocks/${stock}/current_price`));

  const stockPriceLog = {
    timestamp: new Date(Date.now()).toISOString(),
    price: oldStockPrice.val(),
    stock_ticker: stock,
    volumeTraded: Math.floor(Math.random() * 1000000),
  }

  const record_name = uuidv4();

  const stockPriceLogRef = ref(database, `price_history/${record_name}`);
  await set(stockPriceLogRef, stockPriceLog);
}

async function saveStocksPrices(stocksPrices) {
  for (const stock in stocksPrices) {
    await logOldPrice(stock);

    const stockRef = ref(database, `stocks/${stock}/current_price`);
    await set(stockRef, stocksPrices[stock]);
  }
}

module.exports = {getEventData, saveEvaluation, saveProjection, updateEventStatus, saveStocksPrices};
