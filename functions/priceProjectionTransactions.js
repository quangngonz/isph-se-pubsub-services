const {database} = require("../services/firebaseService");
const {ref, get, set} = require('firebase/database');

const {formatTransactions, getTransactionsAfterTime, getTotalTransactions} = require('./utils/transactionParser');

const moment = require('moment');

// Example of a transaction object:
// '8289c9cc-7eb2-4486-b9ab-e165a9f20172': {
//   quantity: 53,
//     stock_ticker: 'RBH',
//     timestamp: '2024-12-06T12:23:24.987188',
//     transaction_id: '8289c9cc-7eb2-4486-b9ab-e165a9f20172',
//     transaction_type: 'BUY',
//     user_id: 'quang_ngo'
// },

const projectTransactions = async () => {
  // TODO: Create a function that projects transactions based on the current stock prices and the transactions data
  const transactionsRef = ref(database, 'transactions');
  const transactionsSnapshot = await get(transactionsRef);
  const transactions = transactionsSnapshot.val();

  // console.log('Projecting transactions:', transactions);
  
  let grouped_transactions = formatTransactions(transactions);

  const filteredTransactions = await getTransactionsAfterTime(grouped_transactions, moment().subtract(14, 'days'))

  // console.log('Grouped transactions:', grouped_transactions);
  // console.log('Transactions in the last 2 weeks:', filteredTransactions);
  console.log('Total transactions:', await getTotalTransactions(filteredTransactions));

  return transactions
}


module.exports = {projectTransactions};
