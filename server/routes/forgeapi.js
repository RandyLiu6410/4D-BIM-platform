const router = require('express').Router();
var Axios = require('axios');               // A Promised base http client
const querystring = require('querystring');

// Forge Bucket
var FORGE_CLIENT_ID = '';
var access_token = '';
var fileToUpload = null;

router.route('/api/forge/oauth').post((req, res) => {
    const scopes = 'data:read data:write data:create bucket:create bucket:read';
    FORGE_CLIENT_ID = req.body.FORGE_CLIENT_ID;

    Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/authentication/v1/authenticate',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        data: querystring.stringify({
            client_id: req.body.FORGE_CLIENT_ID,
            client_secret: req.body.FORGE_CLIENT_SECRET,
            grant_type: 'client_credentials',
            scope: scopes
        })
    })
        .then(function (response) {
            // Success
            access_token = response.data.access_token;
            console.log(response);
            res.redirect('/forgeapi/api/forge/datamanagement/bucket/create');
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to authenticate');
        });
});

// Route /api/forge/datamanagement/bucket/create
router.route('/api/forge/datamanagement/bucket/create').get((req, res) => {
    const bucketKey = FORGE_CLIENT_ID.toLowerCase() + '_tutorial_bucket'; // Prefix with your ID so the bucket key is unique across all buckets on all other accounts
    const policyKey = 'transient'; // Expires in 24hr

    // Create an application shared bucket using access token from previous route
    // We will use this bucket for storing all files in this tutorial
    Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/oss/v2/buckets',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + access_token
        },
        data: JSON.stringify({
            'bucketKey': bucketKey,
            'policyKey': policyKey
        })
    })
    .then(function (response) {
        // Success
        console.log(response);
        res.redirect('/forgeapi/api/forge/datamanagement/bucket/detail');
    })
    .catch(function (error) {
        if (error.response && error.response.status == 409) {
            console.log('Bucket already exists, skip creation.');
            res.redirect('/forgeapi/api/forge/datamanagement/bucket/detail');
        }
        // Failed
        console.log(error);
        res.send('Failed to create a new bucket');
    });
});

// Route /api/forge/datamanagement/bucket/detail
router.route('/api/forge/datamanagement/bucket/detail').get((req, res) => {
    const bucketKey = FORGE_CLIENT_ID.toLowerCase() + '_tutorial_bucket'; // Prefix with your ID so the bucket key is unique across all buckets on all other accounts
    Axios({
        method: 'GET',
        url: 'https://developer.api.autodesk.com/oss/v2/buckets/' + encodeURIComponent(bucketKey) + '/details',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    })
        .then(function (response) {
            // Success
            console.log(response);
            res.send('Success to verify the new bucket')
        })
        .catch(function (error) {
            // Failed
            console.log(error);
            res.send('Failed to verify the new bucket');
        });
});

// For converting the source into a Base64-Encoded string
var Buffer = require('buffer').Buffer;
String.prototype.toBase64 = function () {
    // Buffer is part of Node.js to enable interaction with octet streams in TCP streams, 
    // file system operations, and other contexts.
    return new Buffer(this).toString('base64');
};

var multer = require('multer');         // To handle file upload
var upload = multer({ dest: 'tmp/' }); // Save file into local /tmp folder

// Route /api/forge/datamanagement/bucket/upload
router.route('/api/forge/datamanagement/bucket/upload').post( upload.single('fileToUpload'), function (req, res) {
    const bucketKey = FORGE_CLIENT_ID.toLowerCase() + '_tutorial_bucket'; // Prefix with your ID so the bucket key is unique across all buckets on all other accounts
    var fs = require('fs'); // Node.js File system for reading files
    fs.readFile(req.file.path, function (err, filecontent) {
        Axios({
            method: 'PUT',
            url: 'https://developer.api.autodesk.com/oss/v2/buckets/' + encodeURIComponent(bucketKey) + '/objects/' + encodeURIComponent(req.file.originalname),
            headers: {
                Authorization: 'Bearer ' + access_token,
                'Content-Disposition': req.file.originalname,
                'Content-Length': filecontent.length
            },
            data: filecontent,
            maxContentLength: 100000000,
            maxBodyLength: 1000000000
        })
            .then(function (response) {
                // Success
                console.log(response);
                var urn = response.data.objectId.toBase64();
                res.redirect('/forgeapi/api/forge/modelderivative/' + urn);
            })
            .catch(function (error) {
                // Failed
                console.log(error);
                res.send('Failed to create a new object in the bucket');
            });
    });
});

// Route /api/forge/modelderivative
router.route('/api/forge/modelderivative/:urn').get((req, res) => {
    var urn = req.params.urn;
    var format_type = 'svf';
    var format_views = ['2d', '3d'];
    //console.log(access_token)
    Axios({
        method: 'POST',
        url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/job',
        headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + access_token
        },

        maxContentLength: 100000000, //set content and body lenth to infinity
        maxBodyLength: 1000000000,

        data: JSON.stringify({
            'input': {
                'urn': urn
            },
            'output': {
                'formats': [
                    {
                        'type': format_type,
                        'views': format_views
                    }
                ]
            }
        })
    })
    .then(function (response) {
        // Success
        console.log(response);
        res.json({
            message: 'success',
            urn: urn
        });

        // Upload urn to the database
    })
    .catch(function (error) {
        // Failed
        console.log(error);
        res.send('Error at Model Derivative job.');
    });
});

module.exports = router;