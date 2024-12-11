const {getEventWeights, getStocks} = require("./functions/server_data_fetcher");
const {decayStocks, sumWeights} = require("./functions/manipulateStockPrices");

// Loop that runs engine
const engine = async function (time_passed) {
  console.log('____________________');
  console.log('Current time:', new Date().toISOString());
  console.log('I am an engine running the ISPH Stock Exchange');
  console.log('Time passed since last cycle:', time_passed, 'ms');

  const eventWeights = await getEventWeights(true);
  const stocks = await getStocks(true);
  decayStocks(stocks, {tableName: "Stocks after decay", log: true});
  await sumWeights(eventWeights, time_passed);

  console.log('____________________');
};


exports.engine = engine;
