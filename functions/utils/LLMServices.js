const OpenAI = require('openai');
const {GoogleGenerativeAI} = require('@google/generative-ai');

const dotenv = require('dotenv');
const {ref, get} = require("firebase/database");
const {database} = require("../../services/firebaseService");
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Configure OpenAI API key
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY, // Ensure your API key is set in the environment
});

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the Generative Model
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro', // Adjust as per your API access
});

// Generation Configuration
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

/**
 * Generate evaluation using OpenAI.
 * @param {String} prompt - The event data.
 * @returns {Promise<string>} - The evaluation response or an error message.
 */
async function generateEvaluationOpenAI(prompt) {

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Specify the correct model
      messages: [{role: 'user', content: prompt}],
    });

    // Extract and return the response
    return (
      response.choices[0]?.message.content.trim() || 'No evaluation generated.'
    );
  } catch (error) {
    console.error('Error generating evaluation with OpenAI:', error);
    return 'Error in generating evaluation with OpenAI.';
  }
}

/**
 * Generate evaluation using OpenAI.
 * @param {String} prompt - The event data.
 * @returns {Promise<string>} - The evaluation response or an error message.
 */
async function generateEvaluationGemini(prompt) {
  try {
    // Start a chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the prompt and get the result
    const result = await chatSession.sendMessage(prompt);

    // Extract and return the text response
    // Extract between ```json and ```
    // TODO: Use structured response from Gemini
    const response = result.response.text().trim();
    const start = response.indexOf('```json') + 7;
    const end = response.indexOf('```', start);
    const explanation = response.substring(end, response.length).trim();

    // Extract the rest of the response

    console.log('____________________________________________________________');
    console.log('Response:', response.substring(start, end).trim());
    console.log('Explanation:', explanation);

    // convert to JSON
    const json = JSON.parse(response.substring(start, end).trim());
    console.log('JSON:', json);
    console.log('____________________________________________________________');
    return json || 'No evaluation generated.';
  } catch (error) {
    console.error('Error generating evaluation with Gemini:', error);
    return 'Error in generating evaluation with Gemini.';
  }
}

const getStockList = async () => {
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

  return stock_list;
};

async function generateBangerHeadlineGemini(prompt) {
  try {
    console.log('Generating banger headline with Gemini');

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          response: {
            type: "object",
            properties: {
              headline: {
                type: "string"
              },
              tags: {
                type: "array",
                items: {
                  type: "string"
                }
              }
            },
            required: ["headline", "tags"]
          }
        },
        required: ["response"]
      },
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Send the prompt and get the result
    const result = await chatSession.sendMessage(prompt);

    // Extract the JSON response
    const jsonResponse = JSON.parse(result.response.text());
    console.log(jsonResponse);

    // Ensure the returned JSON contains the expected structure
    if (jsonResponse.response && jsonResponse.response.headline && jsonResponse.response.tags) {
      return jsonResponse.response;
    } else {
      console.error('Invalid response structure:', jsonResponse);
    }
  } catch (error) {
    console.error('Error:', error.message || error);
    return {headline: "", tags: []}; // Default fallback
  }
}

module.exports = {generateEvaluationOpenAI, generateEvaluationGemini, generateBangerHeadlineGemini, getStockList};
