const moment = require('moment');
const Table = require('cli-table3');

/**
 * Format transactions by sorted by timestamp.
 * @param transactions : object transactions
 * @returns {} transactions sorted by timestamp
 */
const formatTransactions = (transactions) => {
  // Sort transactions by timestamp
  return Object.values(transactions).sort((a, b) => {
    return moment(a['timestamp']).diff(moment(b['timestamp']));
  })
}

/**
 * Get transactions within a specified timeframe.
 * @param sortedTransactions : object transactions sorted by timestamp
 * @param cutOffTime : moment.Moment cut-off time
 * @returns {Promise<[]>} transactions within the specified timeframe
 */
const getTransactionsAfterTime = async (sortedTransactions, cutOffTime) => {
  // console.log('Cut-off timestamp:', cutOffTime.format()); // Format for readable output

  const transactions = [];

  for (const transaction of sortedTransactions) {
    const transaction_timestamp = moment(transaction['timestamp']);
    if (transaction_timestamp.isAfter(cutOffTime)) {
      transactions.push(transaction);
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
        'buy': 0,
        'sell': 0
      };
    }
    totalTransactions[stock_ticker][transaction_type] += quantity;
  }

  return totalTransactions;
}

/**
 * Log transactions to the console.
 * @param filteredTransactions : object transactions
 * @param title : string - title of the table
 */
const logTransactions = (filteredTransactions, title = NaN) => {
  // Table log for transactions using keys from the first transaction
  const table_filtered = new Table({
    head: Object.keys(filteredTransactions[0])
  });

  filteredTransactions.forEach(transaction => {
    transaction['timestamp'] = moment(transaction['timestamp']).format('YYYY-MM-DD HH:mm:ss');
    table_filtered.push(Object.values(transaction));
  });

  if (title) {
    console.log(title);
  }

  console.log(table_filtered.toString());
}


module.exports = {getTransactionsAfterTime, getTotalTransactions, formatTransactions, logTransactions};
