const {getEventWeights, getStocks} = require("./functions/server_data_fetcher");
const {decayStocks, sumWeights} = require("./functions/manipulateStockPrices");
const {projectTransactions} = require("./functions/priceProjectionTransactions");
const {saveStocksPrices} = require("./services/dbService");

// Mock Function randomise stock prices
const randomiseStockPrices = (stocks, log = false) => {
  let output = {};

  for (const stock in stocks) {
    const trajectory = Math.random() > 0.5 ? 1 : -1;
    const priceChange = (Math.random() * (0.1 - 10) + 10) * trajectory;
    output[stock] = Math.round(stocks[stock]['current_price'] * (1 + priceChange / 100) * 100) / 100;
  }

  log ? console.log('Stocks after randomisation:', output) : null;

  return output;
}

// Loop that runs engine
const engine = async function (time_passed) {
  console.log('____________________');
  console.log('Current time:', new Date().toISOString());
  console.log('I am an engine running the ISPH Stock Exchange');
  console.log('Time passed since last cycle:', time_passed, 'ms');

  const eventWeights = await getEventWeights(true);
  const stocks = await getStocks(true);
  decayStocks(stocks, {tableName: "Stocks after decay", log: true});
  const resultant_stock = await sumWeights(eventWeights, time_passed);

  // const updated_stocks = randomiseStockPrices(stocks, true);
  // await saveStocksPrices(updated_stocks);

  const transactions = await projectTransactions();


  console.log('____________________');
};

exports.engine = engine;
