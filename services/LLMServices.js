const OpenAI = require('openai');
const {GoogleGenerativeAI} = require('@google/generative-ai');

const dotenv = require('dotenv');
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
    const response = result.response.text().trim();
    const start = response.indexOf('```json') + 7;
    const end = response.indexOf('```', start);

    console.log('____________________________________________________________');
    console.log('Response:', response.substring(start, end).trim());

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

module.exports = {generateEvaluationOpenAI, generateEvaluationGemini};
