const Table = require("cli-table3");
const {getStocks} = require("./server_data_fetcher");
const {getAffectingEvents} = require("./utils/WeightsProcessor");

const decayStocks = (stocks, {decayRate = 0.0001, tableName = "", log = false} = {}) => {
  const decayStockPrice = (stockPrice, decayRate) => {
    return Math.round(stockPrice * (1 - decayRate) * 1000) / 1000;
  };

  if (tableName) {
    console.log(`\n${tableName}:`);
  }

  for (const stockKey in stocks) {
    stocks[stockKey]['current_price'] = decayStockPrice(stocks[stockKey]['current_price'], decayRate);
  }

  if (log) {
    const table = new Table({
      head: Object.keys(stocks[Object.keys(stocks)[0]]),
      wordWrap: true,
    });

    for (const stockKey in stocks) {
      table.push(Object.values(stocks[stockKey]));
    }

    console.log(table.toString());
  }
};

const sumWeights = async (eventWeights, time_passed) => {
  console.log(`Time passed: ${time_passed}`);
  let stocks = await getStocks();

  let stockKeys = Object.keys(stocks);
  let resultant_effect = {};
  for (const key in stockKeys) {
    resultant_effect[stockKeys[key]] = [];
  }

  const eventAffecting = await getAffectingEvents(eventWeights, time_passed);

  for (const event in eventAffecting) {
    let evals = eventWeights[event]['evaluation'];
    for (const stock in evals) {
      resultant_effect[stock].push(evals[stock]);
    }
  }

  console.log(`Resultant Effect: ${JSON.stringify(resultant_effect)}`);
  return resultant_effect;
}

module.exports = {decayStocks, sumWeights};
