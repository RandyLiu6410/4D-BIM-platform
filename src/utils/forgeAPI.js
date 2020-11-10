const axios = require('axios');

var URL = 'http://' + process.env.REACT_APP_Forge_API_URL;

var forgeAPI = {};

forgeAPI.get = (route, config) => {
    return new Promise(async (resolve, reject) => {
        axios.get(URL + route, config)
        .then((responce) => {
            resolve(responce);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

forgeAPI.post = (route, data, config) => {
    return new Promise(async (resolve, reject) => {
        axios.post(URL + route, data, config)
        .then((responce) => {
            resolve(responce);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

module.exports = forgeAPI;