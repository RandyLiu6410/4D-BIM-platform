const { uuid } = require('uuidv4');
// import config from '/Users/CodeE/Desktop/jacob-team/firebaseConfig.js';
const router = require('express').Router();
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

require('dotenv').config()

// Import schema
const projectSchema = require('../database/models/project');
const modelSchema = require('../database/models/model');

var firebaseConfig = require(process.env.firebaseconfig_PATH);

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

router.route('/').get(async (req, res) => {
    const docRef = await firestore.collection('projects').get()

    docRef.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
})

router.route('/').post(async (req, res) => {
    try {
        const value = await projectSchema.validateAsync(req.body);

        const docRef = await firestore.collection('projects').doc(value.id).set(value)

        res.json({
            message: "Add a project successfully.",
            status: 1,
            details: []
        })
    }
    catch (err) {
        res.json({
            message: "Failed to add a project.",
            status: 0,
            details: [
                {
                    validate: err.details
                }
            ]
        })
    }
})

router.route('/projectmodel/').post(async (req, res) => {
    try {
        const value = await modelSchema.validateAsync(req.body);

        const modelid = uuid();
        
        // Add model doc
        await firestore.collection('projects').doc(req.query.projectid).collection('models').doc(modelid).set(value);

        // Modify project doc
        const docRef = firestore.collection('projects').doc(req.query.projectid)
        await docRef.update({
            models: firebase.firestore.FieldValue.arrayUnion(modelid)
        });

        res.json({
            message: `Add a model to project ${req.query.projectid} successfully.`,
            status: 1,
            details: []
        })
    }
    catch (err) {
        res.json({
            message: `Failed to add a model to project ${req.query.projectid}.`,
            status: 0,
            details: [
                {
                    validate: err.details
                }
            ]
        })
    }
})

module.exports = router;