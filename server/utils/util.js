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
    return new Promise((resolve, jeject) => {
        var array = [];

        docRef.forEach((doc) => {
            // console.log(doc.id, '=>', doc.data());
            array.push(doc.data())
        });

        resolve(array)
    })
}

util.verifyToken = (token) => {
    const nowdate = new Date();
    var decoded = jwt.decode(token, {
        alg: "RS256",
        typ: "JWT"
    })

    return nowdate.getTime() < (decoded.exp * 1000);
}

util.decodeJWT = (token) => {
    return jwt.decode(token, {
        alg: "RS256",
        typ: "JWT"
    })
}

module.exports = util;