const initDatabases = require('./db/db');
const dbu = require('./db/dbutils');

const express = require('express')
const app = express()

const routes = require('./routes/index')


initDatabases().then(dbs => {
    dbu.db = dbs;
    // Initialize the application once database connections are ready.
    routes(app).listen(3000, () => console.log('Listening on port 3000'))
}).catch(err => {
    console.error('Failed to make all database connections!')
    console.error(err)
    process.exit(1)
})