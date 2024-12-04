const {database} = require('../services/dbService');
const {ref, get, set} = require('firebase/database');

async function createNewUser(userId, house, username = NaN) {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    console.error('User already exists', {userId});
    return;
  }

  const userData = {
    user_id: userId,
    house: house,
    username: username || `User ${userId}`,
    role: 'student',
    createdAt: new Date().toISOString(),
  }

  await set(userRef, userData);

  console.log('User created:', {userId, userData});
}

module.exports = {createNewUser};
