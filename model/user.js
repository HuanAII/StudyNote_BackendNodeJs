const admin = require('../config/firebase');
const db = admin.firestore();

exports.createUserProfile = async (uid, data) => {
  await db.collection('users').doc(uid).set(data);
};

exports.getUserProfile = async (uid) => {
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? doc.data() : null;
};
