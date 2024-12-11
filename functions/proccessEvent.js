const {generateEvaluation, projectEffectiveness} = require('../services/evaluationService');
const {getEventData, saveEvaluation, saveProjection, updateEventStatus} = require('../services/dbService');

/**
 * Process an event task.
 * @param message
 * @returns {Promise<void>}
 */
const processEvent = async (message) => {
  const taskData = JSON.parse(message);
  const {eventId} = taskData;

  console.log('Received task for processing:', {eventId});

  try {
    // Assuming the event ID is used to fetch event data from a database (or any other source)
    const eventData = await getEventData(eventId); // Replace with your actual data fetching logic

    if (!eventData) {
      console.error('Event not found', {eventId});
      return;
    }

    console.log('Retrieved event data:', {eventData});

    // Call the evaluation function
    const evaluation = await generateEvaluation(eventData);
    await new Promise(resolve => setTimeout(resolve, 10000));
    const projection = await projectEffectiveness(eventData);
    await new Promise(resolve => setTimeout(resolve, 60000));

    console.log('Evaluation result:', {evaluation});
    console.log('Projection result:', {projection});

    await saveEvaluation(eventId, evaluation);
    await saveProjection(eventId, projection);
    await updateEventStatus(eventId, true);
  } catch (error) {
    console.error('Error processing task', {eventId, error: error.message});
  }
};

module.exports = {processEvent};
