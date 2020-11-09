var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

const config = {
  apiKey: process.env.REACT_APP_firebaseconfig_apiKey,
  authDomain: process.env.REACT_APP_firebaseconfig_authDomain,
  databaseURL: process.env.REACT_APP_firebaseconfig_databaseURL,
  projectId: process.env.REACT_APP_firebaseconfig_projectId,
  storageBucket: process.env.REACT_APP_firebaseconfig_storageBucket,
  messagingSenderId: process.env.REACT_APP_firebaseconfig_messagingSenderId,
  appId: process.env.REACT_APP_firebaseconfig_appId,
  measurementId: process.env.REACT_APP_firebaseconfig_measurementId
}

const Firebase = firebase.initializeApp(config);

export default firebase;