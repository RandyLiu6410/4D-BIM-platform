var express = require('express');           // For web server
var Axios = require('axios');               // A Promised base http client
var bodyParser = require('body-parser');    // Receive JSON format
const cors = require('cors');

// Set up Express web server
var app = express();
app.use(bodyParser.json());
app.use(cors());

const forgeApiRouter = require('./routes/forgeapi');
const databaseRouter = require('./routes/database');

app.use('/forgeapi', forgeApiRouter);
app.use('/database', databaseRouter);


// This is for web server to start listening to port 8080
app.set('port', 8080);
var server = app.listen(app.get('port'), function () {
    console.log('Server listening on port ' + server.address().port);
});