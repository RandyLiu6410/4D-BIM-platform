// utils
const httpResponse = require('../utils/httpResponse');
var util = require('../utils/util');
// firebase admin
var admin = require("firebase-admin");

var serviceAccount = require(process.env.firebaseadminkey_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jacob-4d-bim-platform.firebaseio.com"
});

var authController = {};

authController.getUserToken = (param) => {
    admin.auth().createCustomToken(param.uid)
    .then(customToken => {
        // Send token back to client
        param.succFunc(customToken);
    })
    .catch(err => {
        param.failFunc(err)
    });
}

authController.setAdmin = (param) => {
    admin.auth().setCustomUserClaims(param.uid, {role: 'admin'})
    .then(() => {
        param.succFunc('admin');
    })
    .catch(err => {
        param.failFunc(err)
    });
}

authController.setUser = (param) => {
    admin.auth().setCustomUserClaims(param.uid, {role: 'user'})
    .then(() => {
        param.succFunc('user');
    })
    .catch(err => {
        param.failFunc(err)
    });
}

authController.checkAdmin = (req, res, next) => {
    next()
    // admin.auth().getUser(util.decodeJWT(req.headers['access_token']).uid)
    // .then(userRecord => {
    //     if(userRecord.customClaims['role'] === 'admin') return next()

    //     res.status(httpResponse.Unauthorized).json('Unauthorized');
    // })
    // .catch(err => {
    //     res.status(httpResponse.Unauthorized).json('Unauthorized');
    // });
}

authController.verifyToken = (req, res, next) => {
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
}

module.exports = authController;