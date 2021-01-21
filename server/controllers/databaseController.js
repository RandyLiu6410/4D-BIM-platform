const { uuid } = require('uuidv4');
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

require('dotenv').config()

// Import schema
const projectSchema = require('../models/project');
const modelSchema = require('../models/model');
const accountSchema = require('../models/account');

// utils
var util = require('../utils/util');

// firebase firestore
var firebaseConfig = require(process.env.firebaseconfig_PATH);

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

var databaseController = {};

databaseController.getAllUsers = (param) => {
    firestore.collection('users').get()
    .then(docRef => {
        util.pushArray(docRef)
        .then(u => {
            param.succFunc(u);
        })
    })
    .catch(err => {
        param.failFunc(err);
    })
}

databaseController.getUserInfo = (param) => {
    firestore.collection('users').doc(param.uid).get()
    .then(doc => {
        param.succFunc(doc.data());
    })
    .catch(err => {
        param.failFunc(err);
    })
}

databaseController.getAllProjects = (param) => {
    firestore.collection('projects').get()
    .then(docRef => {
        util.pushArray(docRef)
        .then(p => {
            param.succFunc(p);
        })
    })
    .catch(err => {
        param.failFunc(err);
    })
}

databaseController.getProjectInfo = (param) => {
    firestore.collection('users').doc(param.uid).get()
    .then(userdoc => {
        if(userdoc.data().projects.includes(param.projectId)){
            firestore.collection('projects').doc(param.projectId).get()
            .then(doc => {
                param.succFunc(doc.data());
            })
            .catch(err => {
                param.failFunc(err);
            })
        }
        else{
            param.failFunc("Unauthorized");
        }
    })
    .catch(err => {
        param.failFunc(err);
    })
}

databaseController.getProjectModel = (param) => {
    firestore.collection('projects').doc(param.projectId).collection('models').get()
    .then(docRef => {
        util.pushArray(docRef)
        .then(p => {
            param.succFunc(p);
        })
    })
    .catch(err => {
        param.failFunc(err);
    })
}

databaseController.getProjectsByUser = (param) => {
    firestore.collection('users').doc(param.uid).get()
    .then(docRef => {
        param.succFunc(docRef.data().projects);
    })
    .catch(err => {
        param.failFunc(err);
    })
}

databaseController.addProjectToUser = (param) => {
    firestore.collection('projects').doc(param.projectId).get()
    .then(doc => {
        // Only Manager
        if(doc.data().manager === param.senderUid){
            // Modify user doc
            const docRef = firestore.collection('users').doc(param.uid);
            docRef.update({
                projects: firebase.firestore.FieldValue.arrayUnion(param.projectId)
            })
            .then(() => {
                param.succFunc(param);
            })
            .catch(err => {
                param.failFunc(err);
            })
        }
        else{
            param.failFunc("Unauthorized");
        }
    })
    .catch(err => {
        param.failFunc(err);
    })
}

databaseController.createProject = async (param) => {
    try {
        const value = await projectSchema.validateAsync(param.value);

        firestore.collection('projects').doc(value.id).set(value)
        .then(() => {
            param.succFunc(value);
        })
        .catch(err => {
            param.failFunc(err);
        })
    }
    catch (err) {
        param.failFunc(err.details);
    }
}

databaseController.addModel = async (param) => {
    try {
        const value = await modelSchema.validateAsync(param.value);

        firestore.collection('users').doc(param.senderUid).get()
        .then(userdoc => {
            if(userdoc.data().projects.includes(param.projectId)){
                // Add model doc
                firestore.collection('projects').doc(param.projectId).collection('models').doc(value.id).set(value)
                .then(() => {
                    // Modify project doc
                    firestore.collection('projects').doc(param.projectId).update({
                        models: firebase.firestore.FieldValue.arrayUnion(value.id)
                    })
                    .then(() => {
                        param.succFunc(value);
                    })
                    .then(err => {
                        param.failFunc(err);
                    })
                })
                .catch(err => {
                    param.failFunc(err);
                })
            }
            else{
                param.failFunc("Unauthorized");
            }
        })
        .catch(err => {
            param.failFunc(err);
        })
    }
    catch (err) {
        param.failFunc(err.details);
    }
}

module.exports = databaseController;