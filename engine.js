const {getEventWeights, getStocks} = require("./functions/server_data_fetcher");
const Table = require("cli-table3");

// Loop that runs engine
const engine = async function (time_passed) {
  console.log('____________________');
  console.log('Current time:', new Date().toISOString());
  console.log('I am an engine running the ISPH Stock Exchange');
  console.log('Time passed since last cycle:', time_passed, 'ms');

  const eventWeights = await getEventWeights(true);
  const stocks = await getStocks(true);
  decayStocks(stocks, {tableName: "Stocks after decay", log: true});

  console.log('____________________');
};

const decayStocks = (stocks, {decayRate = 0.002, tableName = "", log = false} = {}) => {
  const decayStockPrice = (stockPrice, decayRate) => {
    return Math.round(stockPrice * (1 - decayRate) * 100) / 100;
  };

  if (tableName) {
    console.log(`\n${tableName}:`);
  }

  if (log) {
    const table = new Table({
      head: Object.keys(stocks[Object.keys(stocks)[0]]),
      wordWrap: true,
    });

    for (const stockKey in stocks) {
      const stock = stocks[stockKey];
      stock['current_price'] = decayStockPrice(stock['current_price'], decayRate);
      table.push(Object.values(stock));
    }

    console.log(table.toString());
  }
}


exports.engine = engine;
