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
const accountSchema = require('../database/models/account');

var util = require("../controller/util");

// firebase firestore
var firebaseConfig = require(process.env.firebaseconfig_PATH);

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

// firebase admin
var admin = require("firebase-admin");

var serviceAccount = require(process.env.firebaseadminkey_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jacob-4d-bim-platform.firebaseio.com"
});

///////////////
// To deal with users
///////////////

router.route('/users').get(async (req, res) => {
    const docRef = await firestore.collection('users').get();

    const getProjects = () => {
        return new Promise((resolve, jeject) => {
            var users = [];

            docRef.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                users.push(doc.data())
            });

            resolve(users)
        })
    }

    getProjects()
    .then(u => {
        res.json(u);
    })
})

router.route('/getuserinfo').get(async (req, res) => {
    firestore.collection('users').doc(req.query.uid).get()
    .then(doc => {
        res.json(doc.data());
    })
    .catch(err => {
        res.json(err);
    })
})

///////////////
// To deal with projects
///////////////

// Get all projects
router.route('/').get(async (req, res) => {
    const docRef = await firestore.collection('projects').get();

    const getProjects = () => {
        return new Promise((resolve, jeject) => {
            var projects = [];

            docRef.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                projects.push(doc.data())
            });

            resolve(projects)
        })
    }

    getProjects()
    .then(p => {
        res.json(p);
    })
})

// Get project info
router.route('/getprojectinfo').get(async (req, res) => {
    firestore.collection('projects').doc(req.query.projectId).get()
    .then(doc => {
        res.json(doc.data());
    })
    .catch(err => {
        res.json(err);
    })
})

// Get projects of user
router.route('/getuserprojects').get(async (req, res) => {
    firestore.collection('users').doc(req.query.uid).get()
    .then(docRef => {
        res.json(docRef.data().projects);
    })
    .catch(err => {
        res.json(err)
    })
})

// Add a project to user
router.route('/adduserproject').post(async (req, res) => {
    // Modify user doc
    const docRef = firestore.collection('users').doc(req.query.uid)
    docRef.update({
        projects: firebase.firestore.FieldValue.arrayUnion(req.query.projectId)
    })
    .then(doc => {
        res.json({
            message: `Add project ${req.query.projectId} to user ${req.query.uid} successfully.`,
            status: 1,
            details: {}
        })
    })
    .catch(err => {
        res.json({
            message: `Failed to add project ${req.query.projectId} to user ${req.query.uid}.`,
            status: 0,
            details: {
                message: err
            }
        })
    })
})

// Add a project
router.route('/project').post(async (req, res) => {
    try {
        console.log(req)
        const _value = {
            id: uuid(),
            name: req.query.name,
            location: {
                country: req.query.country,
                city: req.query.city,
                street: req.query.street
            },
            manager: req.query.manager,
            createdAt: (new Date()).getTime(),
            models: []
        }
        console.log(_value)
        const value = await projectSchema.validateAsync(_value);

        const docRef = await firestore.collection('projects').doc(value.id).set(value)

        res.json({
            message: "Add a project successfully.",
            status: 1,
            details: {
                projectId: value.id
            }
        })
    }
    catch (err) {
        res.json({
            message: "Failed to add a project.",
            status: 0,
            details: {
                message: err.details
            }
        })
    }
})

router.route('/projectmodel/').get(async (req, res) => {
    if(req.query.projectId)
    {
        const docRef = await firestore.collection('projects').doc(req.query.projectId).collection('models').get();
    
        const getModels = () => {
            return new Promise((resolve, jeject) => {
                var models = [];

                docRef.forEach((doc) => {
                    // console.log(doc.id, '=>', doc.data());
                    models.push(doc.data())
                });

                resolve(models)
            })
        }

        getModels()
        .then(m => {
            res.json(m);
        })
    }
    else
    {
        res.json({
            message: `No parameter named ${"projectId"}`,
            status: 0,
            details: {}
        })
    }
})

// Add a model
router.route('/projectmodel/').post(async (req, res) => {
    try {
        const value = await modelSchema.validateAsync({
            ...util.objectWithoutProperties(req.query, "projectId"),
            id: uuid(),
            createdAt: (new Date()).getTime()
        });

        // Add model doc
        await firestore.collection('projects').doc(req.query.projectId).collection('models').doc(value.id).set(value);

        // Modify project doc
        const docRef = firestore.collection('projects').doc(req.query.projectId)
        await docRef.update({
            models: firebase.firestore.FieldValue.arrayUnion(value.id)
        });

        res.json({
            message: `Add a model to project ${req.query.projectId} successfully.`,
            status: 1,
            details: {
                message: value
            }
        })
    }
    catch (err) {
        res.json({
            message: `Failed to add a model to project ${req.query.projectId}.`,
            status: 0,
            details: {
                message: err
            }
        })
    }
})

///////////////
// To deal with user's token creation
///////////////

router.route('/getusertoken/').get(async (req, res) => {
    admin.auth().createCustomToken(req.query.uid)
    .then(function(customToken) {
        // Send token back to client
        console.log(customToken)
        res.json(customToken)
    })
    .catch(function(error) {
        console.log('Error creating custom token:', error);
        res.json(error)
    });
})

router.route('/verifyusertoken/').get(async (req, res) => {
    admin.auth().verifyIdToken(req.query.token)
    .then(function(decodedToken) {
        let uid = decodedToken.uid;
        // ...
        res.json({
            uid: uid
        })
    }).catch(function(error) {
        // Handle error
        res.json({
            error: error
        })
    });
})

router.route('/getuserbyemail/').get(async (req, res) => {
    const query = await firestore.collection('users').where('email', '==', req.query.email)
    .get()
    .then(function(querySnapshot) {
        console.log(querySnapshot)
        if(querySnapshot.size > 0)
        {
            querySnapshot.forEach(function(doc) {
                res.json(doc.data())
            });
        }
        else
        {
            res.json('none')
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        res.json(error)
    });
})

///////////////
// To deal with user creation and login
// for backup
// functions have been moved to client
//
///////////////

router.route('/createuserwithemail/').post(async (req, res) => {
    try {
        const value = await accountSchema.validateAsync(req.query);

        await firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(async (suc) => {// Add model doc
            const userdocRef = await firestore.collection('users').doc(suc.user.uid).set({
                id: suc.user.uid,
                name: {
                    firstName: value.firstName,
                    lastName: value.lastName
                },
                email: value.email,
                projects: []
            });

            res.json({
                message: "Register successfully.",
                status: 1,
                details: {}
            })
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            res.json({
                message: "Failed to register",
                status: 0,
                details: {
                    message: error.message
                }
            })
          });
    }
    catch (err) {
        res.json({
            message: "Failed to register",
            status: 0,
            details: {
                message: err.details
            }
        })
    }
})

router.route('/loginwithemail/').post(async (req, res) => {
    console.log(req.query)
    await firebase.auth().signInWithEmailAndPassword(req.query.email, req.query.password)
    .then((suc) => {
        console.log(suc)
        // suc.getToken().then(function(token){
        //     console.log(token)
        // });

        res.json({
            message: "Login successfully.",
            status: 1,
            details: {
                message: suc.getToken().then(token => {return token})
            }
        })
    })
    .catch(function(error) {
        console.log(error)
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        res.json({
            message: "Failed to Login",
            status: 0,
            details: {
                message: error
            }
        })
    });
})

router.route('/createUserwithgoogle/').post(async (req, res) => {
    try {
        const value = await accountSchema.validateAsync(req.body);

        await firebase.auth().createUserWithEmailAndPassword(value.email, value.password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });

        res.json({
            message: "Register successfully.",
            status: 1,
            details: {}
        })
    }
    catch (err) {
        res.json({
            message: "Failed to register",
            status: 0,
            details: {
                message: err.details
            }
        })
    }
})

module.exports = router;