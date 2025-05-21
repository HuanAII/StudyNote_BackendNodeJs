const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { db } = require("../config/firebase");
require('dotenv').config();

async function registerUserInDatabase(fullname , email, password) {
    const usersRef = db.collection("users");
    const existingUser = await usersRef.where('email', '==', email).get();
    if (!existingUser.empty) {
        return false;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = await usersRef.add({
        email: email,
        password: hashedPassword,
        fullname :fullname,
    });
    return true;
}

async function loginUser(email, password) {
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where('email', '==', email).get();
    console.log(userSnapshot);
    console.log(userSnapshot.empty);
    console.log(userSnapshot.docs);
    if (userSnapshot.empty) return null;

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return null;


    const uid = userDoc.id;


    return jwt.sign({ uid, email: userData.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { registerUserInDatabase, loginUser };
