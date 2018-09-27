const initDatabases = require('./db/db');
const dbu = require('./db/dbutils');

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: true
}));


const routes = require('./routes/index')


initDatabases().then(dbs => {
    dbu.db = dbs;
    dbu.createIndexes();
    // Initialize the application once database connections are ready.
    require('./mqttc/mqttcl')();
    routes(app).listen(3000, () => console.log('Listening on port 3000'))
}).catch(err => {
    console.error('Failed to make all database connections!')
    console.error(err)
    process.exit(1)
})