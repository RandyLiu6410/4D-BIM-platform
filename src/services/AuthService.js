import CookieService from './CookieService';
import Firebase from '../Firebase';
const cookieService = new CookieService();
const axios = require('axios');

var userInfo = null;

var jwt = require('jsonwebtoken');

class AuthService {
    signInWithCustomToken() {
        return new Promise(async (resolve, reject) => {
            try {
                await Firebase.auth().signInWithCustomToken(cookieService.get('access_token'))
                .then((result) => {
                    userInfo = result.user;
                    resolve({
                        user: result.user, 
                        token: cookieService.get('access_token')
                    })
                })
                .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                    console.log(errorMessage)
                    reject(errorMessage)
                });
            }
            catch (error) {
                reject(error);
            }
        })
    }

    setUserInfo(info) {
        userInfo = info;
    }

    getUserInfo() {
        return userInfo;
    }

    getToken() {
        return cookieService.get('access_token');
    }

    verifyToken() {
        const nowdate = new Date();
        if(!cookieService.get('access_token')){
            return false;
        }
        var decoded = jwt.decode(cookieService.get('access_token'), {
            alg: "RS256",
            typ: "JWT"
        })

        return nowdate.getTime() < (decoded.exp * 1000);
    }
}

export default new AuthService();