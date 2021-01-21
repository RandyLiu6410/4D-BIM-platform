const httpResponse = require('./httpResponse');
var jwt = require('jsonwebtoken');
var util = {};

util.objectWithoutProperties = (obj, keys) => {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

util.pushArray = (docRef) => {
    return new Promise((resolve, reject) => {
        var array = [];

        docRef.forEach((doc) => {
            array.push(doc.data())
        });

        resolve(array)
    })
}

util.decodeJWT = (token) => {
    return jwt.decode(token, {
        alg: "RS256",
        typ: "JWT"
    })
}

util.verifyToken = (req, res, next) => {
    const nowdate = new Date();
    var decoded = util.decodeJWT(req.headers['access_token'])

    if(nowdate.getTime() < (decoded.exp * 1000)) return next();

    res.status(httpResponse.Unauthorized).json('token is expired');
}

util.checkDataOwner = (req, res, next) => {
    console.log(util.decodeJWT(req.headers['access_token']).uid)
    if(util.decodeJWT(req.headers['access_token']).uid === req.query.uid) return next();
    
    res.status(httpResponse.Unauthorized).json('Unauthorized');
}

module.exports = util;