var admin = require("firebase-admin");
var serviceAccount = require("C:/Users/ASUS/Downloads/noteapp-e11e5-firebase-adminsdk-fbsvc-347a82df35.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://noteapp-e11e5.firebaseio.com"
});
const db = admin.firestore();
module.exports = { db };