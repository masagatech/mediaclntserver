const initDatabases = require('./db/db');
const dbu = require('./db/dbutils');

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');



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