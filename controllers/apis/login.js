const dbs = require('../../db/dbutils').db;


module.exports = login = {};

login.getlogin = function (req, res) {
    dbs.production.collection('test').find({}).toArray((err, docs) => {
        if (err) {
            console.log(err)
            res.error(err)
        } else {
            res.json(docs)
        }
    })

    return api
}