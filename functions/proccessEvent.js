const { generateEvaluation } = require('../services/evaluationService');
const { getEventData, saveEvaluation } = require('../services/dbService');

const processEvent = async (message) => {
  const taskData = JSON.parse(message);
  const { eventId } = taskData;

  console.log('Received task for processing:', { eventId });

  try {
    // Assuming the event ID is used to fetch event data from a database (or any other source)
    const eventData = await getEventData(eventId); // Replace with your actual data fetching logic

    if (!eventData) {
      console.error('Event not found', { eventId });
      return;
    }

    console.log('Retrieved event data:', { eventData });

    // Call the evaluation function
    const evaluation = await generateEvaluation(eventData);

    console.log('Evaluation result:', { evaluation });

    // You can save the evaluation result back to your database or process it further here
    await saveEvaluation(eventId, evaluation); // Replace with actual DB saving logic
  } catch (error) {
    console.error('Error processing task', { eventId, error: error.message });
  }
};

module.exports = { processEvent };