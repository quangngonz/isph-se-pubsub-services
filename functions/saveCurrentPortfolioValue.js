const {database} = require("../services/firebaseService");
const {ref, get, set} = require('firebase/database');
const {getStocks} = require("./server_data_fetcher");

const moment = require('moment');

const saveDailyPortfolioValues = async () => {
  const today = moment().format('YYYY-MM-DD');

  const portfolioRef = ref(database, `portfolios`);
  const portfolioSnapshot = await get(portfolioRef);
  const portfolios = portfolioSnapshot.val();

  const stockPrices = await getStocks();

  let portfolioValues = {}

  // console.log('Portfolios:', portfolios);
  // console.log('Stock prices:', stockPrices);

  for (const portfolioId in portfolios) {
    const portfolio = portfolios[portfolioId];
    // console.log('Portfolio:', portfolio);
    let portfolioValue = 0;

    const portfolio_stocks = portfolio['items'];

    for (const stock_ticker in portfolio_stocks) {
      const quantity = portfolio_stocks[stock_ticker]['quantity'];
      const stock_price = stockPrices[stock_ticker]['current_price'];
      portfolioValue += quantity * stock_price;
    }

    portfolioValues[portfolioId] = portfolioValue;

    const dailyPortfolioValueRef = ref(database, `daily_portfolio_values/${portfolioId}/${today}`);
    await set(dailyPortfolioValueRef, portfolioValues[portfolioId]);
  }

  console.log('____________________');
  console.log('Portfolio values:', portfolioValues);
  console.log('____________________');
}

exports.saveDailyPortfolioValues = saveDailyPortfolioValues;
