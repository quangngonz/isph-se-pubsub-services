/**
 * Generates a prompt for evaluation based on event and stock list.
 * @param {Object} event - The event data.
 * @param {Array} stockList - The list of stocks.
 * @returns {string} - The generated evaluation prompt.
 */
function generateEvalPrompt(event, stockList) {
  return `
      Event Name: ${event.event_name}
      Description: ${event.event_description}
      Timestamp: ${event.timestamp}
  
      Here is what the teacher suggested:
      ${event.evaluation?.teacher || 'No teacher evaluation provided.'}
  
      Here is what the admin suggested:
      ${event.evaluation?.admin || 'No admin evaluation provided.'}
  
      Here are the stocks that can be evaluated:
      ${stockList.join(', ')}
  
      From the above, the teacher suggested a system evaluation based on the event description and timestamp. The admin suggested a system evaluation based on the event name and timestamp.
  
      Return response in JSON format with the keys of the stocks and the values of the evaluations in percentage up or down.
      ONLY USE THE STOCKS PROVIDED IN THE STOCK LIST.
  
      Example:
      {
          "AAPL": "0.05",
          "GOOGL": "-0.02",
          "TSLA": "0.10"
      }
    `;
}

/**
 * @param event - The event data
 * @param stockList - The list of stocks
 * @returns {string} - The generated projection prompt
 */
function generateProjectionPrompt(event, stockList) {
  return `
  Project the effectiveness of the event ${event} based on the following stocks: ${stockList.join(', ')}.
  
  RETURN RESPONSE IN JSON FORMAT. 
  RESULT Format:
    {
      stock_ticker: { 
        time: [Amount of time the stock will go up, Amount of time the stock will go down], 
        delay: [Amount of delay in the stock going up, Amount of delay in the stock going down]
    }
  `;
}

module.exports = {generateEvalPrompt, generateProjectionPrompt};
