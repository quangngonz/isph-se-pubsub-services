const {database} = require('./firebaseService');
const {ref, get} = require('firebase/database');

const {generateEvalPrompt, generateProjectionPrompt} = require('./promptGenerationService');
const {generateEvaluationOpenAI, generateEvaluationGemini} = require('./LLMServices');

const USE_LLM = process.env.USE_LLM || 'openai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Select and use the appropriate LLM for evaluation.
 * @param {Object} event - The event data.
 * @returns {Promise<String>} - The evaluation response.
 */
async function generateEvaluation(event) {
  // Get stock list from /stocks endpoint
  const stocksRef = ref(database, 'stocks');
  const snapshot = await get(stocksRef);

  if (!snapshot.exists()) {
    return 'Error: No stock list found.';
  }

  const stockList = Object.keys(snapshot.val());
  let stock_list = [];
  for (let i = 0; i < stockList.length; i++) {
    let ticker = stockList[i];
    let name = snapshot.val()[ticker]['full_name'];
    stock_list.push(`${ticker} : ${name}`);
  }

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
 * @returns {Promise<String>} - The projection result.
 */
async function projectEffectiveness(event) {
  // Get stock list from /stocks endpoint
  const stocksRef = ref(database, 'stocks');
  const stock = await get(stocksRef);

  // TODO: Implement the projection logic
  const prompt = generateProjectionPrompt(event, Object.keys(stock.val()));
  console.log(`Prompt: ${prompt}`)

  const evaluation = {"system": "No evaluation"};

  console.log('Evaluation result:', {evaluation});
}

module.exports = {generateEvaluation, projectEffectiveness};
