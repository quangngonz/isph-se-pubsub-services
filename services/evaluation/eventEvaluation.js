const {database} = require('../firebaseService');
const {ref, set, get} = require('firebase/database');

const {generateEvalPrompt, generateProjectionPrompt} = require('../../functions/utils/promptGenerationService');
const {
  generateEvaluationOpenAI,
  generateEvaluationGemini,
  generateBangerHeadlineGemini,
  getStockList
} = require('../../functions/utils/LLMServices');

const USE_LLM = process.env.USE_LLM || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Select and use the appropriate LLM for evaluation.
 * @param {Object} event - The event data.
 * @returns {Promise<String>} - The evaluation response.
 */
async function generateEvaluation(event) {
  const stock_list = await getStockList();

  const prompt = generateEvalPrompt(event, stock_list);

  if (USE_LLM.toLowerCase() === 'openai' && OPENAI_API_KEY) {
    return await generateEvaluationOpenAI(prompt);
  } else {
    return await generateEvaluationGemini(prompt);
  }
}

/**
 * Project the effectiveness of the event based on the stock list.
 * @param {Object} event - The event data.
 * @returns {Promise<{system: string}>} - The projection result.
 */
async function projectEffectiveness(event) {
  // Get stock list from /stocks endpoint
  const stocksRef = ref(database, 'stocks');
  const stocks = await get(stocksRef);
  const stockList = Object.keys(stocks.val());
  let stock_list = [];
  for (let i = 0; i < stockList.length; i++) {
    let ticker = stockList[i];
    let name = stocks.val()[ticker]['full_name'];
    stock_list.push(`${ticker} : ${name}`);
  }

  const prompt = generateProjectionPrompt(event, stock_list);
  console.log(`Prompt: ${prompt}`)

  let projection;

  if (USE_LLM.toLowerCase() === 'openai' && OPENAI_API_KEY) {
    projection = await generateEvaluationOpenAI(prompt);
  } else {
    projection = await generateEvaluationGemini(prompt);

    for (const stock in projection) {
      projection[stock]['time'] = Math.round(projection[stock]['time'] * 24 * 60 * 60 * 1000);
      projection[stock]['delay'] = Math.round(projection[stock]['delay'] * 24 * 60 * 60 * 1000);
    }
  }

  return projection;
}

/**
 * Generate a banger headline for the event.
 * @param message - The event data.
 * @returns {Promise<string|string>}
 */
async function generateBangerHeadline(message) {
  const taskData = JSON.parse(message);
  const {eventId} = taskData;

  const eventRef = ref(database, `events/${eventId}`);
  const snapshot = await get(eventRef);

  if (!snapshot.exists()) {
    console.error('Event not found', {eventId});
    return 'Event not found';
  }

  const event = snapshot.val();

  const prompt = `Generate a banger/click-baiting short headline for the event of the student/staff/member of The Interational School @ PArkCity Hanoi (ISPH): \n\nTITLE: ${event.event_description} \nDescription: ${event.description}.`;

  const headline = await generateBangerHeadlineGemini(prompt);

  // Save the headline to the database
  const headlineRef = ref(database, `events/${eventId}/headline`);
  await set(headlineRef, headline);

  return headline;
}

module.exports = {generateEvaluation, projectEffectiveness, generateBangerHeadline};
