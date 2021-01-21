import CookieService from '../services/CookieService';
const cookieService = new CookieService();
const axios = require('axios');

var URL = 'http://' + process.env.REACT_APP_Database_API_URL;

var databaseAPI = {};

databaseAPI.get = (route, config) => {
    return new Promise(async (resolve, reject) => {
        axios.get(URL + route, {...config, headers: {access_token: cookieService.get('access_token')}})
        .then((responce) => {
            resolve(responce);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

databaseAPI.post = (route, data, config) => {
    return new Promise(async (resolve, reject) => {
        axios.post(URL + route, data, {...config, headers: {access_token: cookieService.get('access_token')}})
        .then((responce) => {
            resolve(responce);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

export default databaseAPI;