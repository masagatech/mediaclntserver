const dbs = require('../../db/dbutils');


module.exports = login = {};

login.getLogin = function (req, res) {
    dbs.col(dbs.colnm.user).find({}).toArray((err, docs) => {
        if (err) {
            console.log(err)
            res.error(err)
        } else {
            res.json(docs)
        }
    })
}


login.createUser = function (req, res) {
    dbs.col(dbs.colnm.user).insertOne(req.body, function (err, result) {

        if (err) {
            console.log(err)
            res.error(err)
        } else {
            res.json(result)
        }
    });


}