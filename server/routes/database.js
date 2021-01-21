const router = require('express').Router();
// utils
const { uuid } = require('uuidv4');
var util = require('../utils/util');
const httpResponse = require('../utils/httpResponse');

var databaseController = require('../controllers/databaseController');
var authController = require('../controllers/authController');

///////////////
// To deal with users
///////////////

router.route('/users').get(util.verifyToken, authController.checkAdmin, async (req, res) => {
    var param = {};
	param.succFunc = function(result){
		res.status(httpResponse.OK).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.OK).json({"status": "fail","message": result});
	};
    databaseController.getAllUsers(param);
})

router.route('/getuserinfo').get(util.verifyToken, async (req, res) => {
    if(!req.query.uid){
        res.status(httpResponse.BadRequest).send('variables cannot be empty.');
        return;
    }

    var param = {};
    param.uid = req.query.uid;
	param.succFunc = function(result){
		res.status(httpResponse.OK).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.NotFound).json({"status": "fail","message": result});
	};
    databaseController.getUserInfo(param);
})

///////////////
// To deal with projects
///////////////

// Get all projects
router.route('/').get(util.verifyToken, authController.checkAdmin, async (req, res) => {
    var param = {};
	param.succFunc = function(result){
		res.status(httpResponse.OK).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.NotFound).json({"status": "fail","message": result});
	};
    databaseController.getAllProjects(param);
})

// Get project info
router.route('/getprojectinfo').get(util.verifyToken, async (req, res) => {
    if(!req.query.projectId){
        res.status(httpResponse.BadRequest).send('variables cannot be empty.');
        return;
    }

    var param = {};
    param.uid = util.decodeJWT(req.headers['access_token']).uid;
    param.projectId = req.query.projectId;
	param.succFunc = function(result){
		res.status(httpResponse.OK).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.NotFound).json({"status": "fail","message": result});
	};
    databaseController.getProjectInfo(param);
})

// Get projects of user
router.route('/getuserprojects').get(util.verifyToken, util.checkDataOwner, async (req, res) => {
    if(!req.query.uid){
        res.status(httpResponse.BadRequest).send('variables cannot be empty.');
        return;
    }

    var param = {};
    param.uid = req.query.uid;
	param.succFunc = function(result){
		res.status(httpResponse.OK).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.NotFound).json({"status": "fail","message": result});
	};
    databaseController.getProjectsByUser(param);
})

// Add a project to user
router.route('/adduserproject').post(util.verifyToken, async (req, res) => {
    if(!req.query.uid || !req.query.projectId){
        res.status(httpResponse.BadRequest).send('variables cannot be empty.');
        return;
    }

    var param = {};
    param.senderUid = util.decodeJWT(req.headers['access_token']).uid;
    param.uid = req.query.uid;
    param.projectId = req.query.projectId;
	param.succFunc = function(result){
		res.status(httpResponse.Created).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.ServiceUnavailable).json({"status": "fail","message": result});
	};
    databaseController.addProjectToUser(param);
})

// Add a project
router.route('/project').post(util.verifyToken, async (req, res) => {
    var param = {};
    param.value = {
        id: uuid(),
        name: req.query.name,
        location: {
            country: req.query.country,
            city: req.query.city,
            street: req.query.street
        },
        manager: req.query.manager,
        creator: util.decodeJWT(req.headers['access_token']).uid,
        createdAt: (new Date()).getTime(),
        models: []
    }
	param.succFunc = function(result){
		res.status(httpResponse.Created).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.BadRequest).json({"status": "fail","message": result});
	};
    databaseController.createProject(param);
})

// Add a model
router.route('/projectmodel/').post(util.verifyToken, async (req, res) => {
    if(!req.query.projectId){
        res.status(httpResponse.BadRequest).send('variables cannot be empty.');
        return;
    }

    var param = {};
    param.senderUid = util.decodeJWT(req.headers['access_token']).uid;
    param.projectId = req.query.projectId;
    param.value = {
        ...util.objectWithoutProperties(req.query, "projectId"),
        id: uuid(),
        createdAt: (new Date()).getTime()
    }
	param.succFunc = function(result){
		res.status(httpResponse.Created).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.BadRequest).json({"status": "fail","message": result});
	};
    databaseController.addModel(param);
})

// Get model info
router.route('/projectmodel/').get(util.verifyToken, async (req, res) => {
    if(!req.query.projectId){
        res.status(httpResponse.BadRequest).send('variables cannot be empty.');
        return;
    }

    var param = {};
    param.projectId = req.query.projectId;
	param.succFunc = function(result){
		res.status(httpResponse.OK).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.NotFound).json({"status": "fail","message": result});
	};
    databaseController.getProjectModel(param);
})

///////////////
// To deal with user's token creation
///////////////

router.route('/getusertoken/').get(async (req, res) => {
    if(!req.query.uid){
        res.status(httpResponse.BadRequest).send('variables cannot be empty.');
        return;
    }

    var param = {};
    param.uid = req.query.uid;
	param.succFunc = function(result){
		res.status(httpResponse.OK).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.Unauthorized).json({"status": "fail","message": result});
	};
    authController.getUserToken(param);
})


// ************* Dangerous ****************
router.route('/setadmin/').get(async (req, res) => {
    if(!req.query.uid){
        res.status(httpResponse.BadRequest).send('variables cannot be empty.');
        return;
    }

    var param = {};
    param.uid = req.query.uid;
	param.succFunc = function(result){
		res.status(httpResponse.OK).json({"status":"ok","data": result});
	};
	param.failFunc = function(result){
		res.status(httpResponse.Unauthorized).json({"status": "fail","message": result});
	};
    authController.setAdmin(param);
})

router.route('/verifyusertoken/').get(authController.verifyToken, async (req, res) => {
    res.json('sss')
})

// router.route('/getuserbyemail/').get(async (req, res) => {
//     const query = await firestore.collection('users').where('email', '==', req.query.email)
//     .get()
//     .then(function(querySnapshot) {
//         console.log(querySnapshot)
//         if(querySnapshot.size > 0)
//         {
//             querySnapshot.forEach(function(doc) {
//                 res.json(doc.data())
//             });
//         }
//         else
//         {
//             res.json('none')
//         }
//     })
//     .catch(function(error) {
//         console.log("Error getting documents: ", error);
//         res.json(error)
//     });
// })

///////////////
// To deal with user creation and login
// for backup
// functions have been moved to client
//
///////////////

// router.route('/createuserwithemail/').post(async (req, res) => {
//     try {
//         const value = await accountSchema.validateAsync(req.query);

//         await firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
//         .then(async (suc) => {// Add model doc
//             const userdocRef = await firestore.collection('users').doc(suc.user.uid).set({
//                 id: suc.user.uid,
//                 name: {
//                     firstName: value.firstName,
//                     lastName: value.lastName
//                 },
//                 email: value.email,
//                 projects: []
//             });

//             res.json({
//                 message: "Register successfully.",
//                 status: 1,
//                 details: {}
//             })
//         })
//         .catch(function(error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             // ...
//             res.json({
//                 message: "Failed to register",
//                 status: 0,
//                 details: {
//                     message: error.message
//                 }
//             })
//           });
//     }
//     catch (err) {
//         res.json({
//             message: "Failed to register",
//             status: 0,
//             details: {
//                 message: err.details
//             }
//         })
//     }
// })

// router.route('/loginwithemail/').post(async (req, res) => {
//     console.log(req.query)
//     await firebase.auth().signInWithEmailAndPassword(req.query.email, req.query.password)
//     .then((suc) => {
//         console.log(suc)
//         // suc.getToken().then(function(token){
//         //     console.log(token)
//         // });

//         res.json({
//             message: "Login successfully.",
//             status: 1,
//             details: {
//                 message: suc.getToken().then(token => {return token})
//             }
//         })
//     })
//     .catch(function(error) {
//         console.log(error)
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // ...
//         res.json({
//             message: "Failed to Login",
//             status: 0,
//             details: {
//                 message: error
//             }
//         })
//     });
// })

// router.route('/createUserwithgoogle/').post(async (req, res) => {
//     try {
//         const value = await accountSchema.validateAsync(req.body);

//         await firebase.auth().createUserWithEmailAndPassword(value.email, value.password).catch(function(error) {
//             // Handle Errors here.
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             // ...
//           });

//         res.json({
//             message: "Register successfully.",
//             status: 1,
//             details: {}
//         })
//     }
//     catch (err) {
//         res.json({
//             message: "Failed to register",
//             status: 0,
//             details: {
//                 message: err.details
//             }
//         })
//     }
// })

module.exports = router;