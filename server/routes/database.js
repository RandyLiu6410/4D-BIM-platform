// import config from '/Users/CodeE/Desktop/jacob-team/firebaseConfig.js';
const router = require('express').Router();
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

require('dotenv').config()

var firebaseConfig = require(process.env.firebaseconfig_PATH);

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

router.route('/').get(async (req, res) => {
    const docRef = await firestore.collection('projects').get()

    docRef.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
})

module.exports = router;