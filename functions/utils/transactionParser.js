const moment = require('moment');

/**
 * Format transactions by grouping them by timestamp.
 * @param transactions : object transactions
 * @returns {{}} transactions grouped by timestamp
 */
const formatTransactions = (transactions) => {
  let grouped_transactions = {};

  // Group transactions by timestamp
  for (const transaction_id in transactions) {
    const transaction = transactions[transaction_id];
    const timestamp = transaction.timestamp;

    if (!grouped_transactions[timestamp]) {
      grouped_transactions[timestamp] = [];
    }

    grouped_transactions[timestamp].push(transaction);
  }
  return grouped_transactions;
}

/**
 * Get transactions within a specified timeframe.
 * @param groupedTransactions : object transactions grouped by timestamp
 * @param cutOffTime : moment.Moment cut-off time
 * @returns {Promise<[]>} transactions within the specified timeframe
 */
const getTransactionsAfterTime = async (groupedTransactions, cutOffTime) => {
  // console.log('Cut-off timestamp:', cutOffTime.format()); // Format for readable output

  const transactions = [];

  for (const timestamp in groupedTransactions) {
    const time = moment(timestamp); // Parse timestamp as a Moment object
    if (time.isSameOrAfter(cutOffTime)) {
      transactions.push(...groupedTransactions[timestamp]);
    }
  }

  return transactions;
};

/**
 * Get total transactions for each stock.
 * @param trimmedTransactions : object transactions grouped by timestamp
 * @returns {Promise<{}>} total transactions for each stock
 */
const getTotalTransactions = async (trimmedTransactions) => {
  let totalTransactions = {};

  for (const transaction_id in trimmedTransactions) {
    const transaction = trimmedTransactions[transaction_id];
    const stock_ticker = transaction['stock_ticker'];
    const quantity = transaction['quantity'];
    const transaction_type = transaction['transaction_type'];

    if (!totalTransactions[stock_ticker]) {
      totalTransactions[stock_ticker] = {
        'BUY': 0,
        'SELL': 0
      };
    }
    totalTransactions[stock_ticker][transaction_type] += quantity;
  }

  return totalTransactions;
}

module.exports = {getTransactionsAfterTime, getTotalTransactions, formatTransactions};
