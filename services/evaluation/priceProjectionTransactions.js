const {database} = require("../firebaseService");
const {ref, get, set} = require('firebase/database');

const {
  formatTransactions,
  getTransactionsAfterTime,
  getTotalTransactions
} = require('../../functions/utils/transactionParser');
const {logTransactions} = require('../../functions/utils/transactionParser');

const moment = require('moment');

const projectTransactions = async () => {
  console.log('____________________');
  // TODO: Create a function that projects transactions based on the current stock prices and the transactions data
  // TODO: Merge the buy sell transactions with it's price
  const transactionsRef = ref(database, 'transactions');
  const transactionsSnapshot = await get(transactionsRef);
  const transactions = transactionsSnapshot.val();

  // console.log('Projecting transactions:', transactions);

  let sortedTransactions = formatTransactions(transactions);
  logTransactions(sortedTransactions, 'Sorted transactions:');

  const filteredTransactions = await getTransactionsAfterTime(sortedTransactions, moment().subtract(14, 'days'))
  logTransactions(filteredTransactions, 'Transactions in the last 2 weeks:');

  // console.log('Grouped transactions:', grouped_transactions);
  // console.log('Transactions in the last 2 weeks:', filteredTransactions);
  console.log('Total transactions:', await getTotalTransactions(filteredTransactions));

  return transactions
}


module.exports = {projectTransactions};
