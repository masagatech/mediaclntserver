const Promise = require("bluebird");

const dbutils = {};

dbutils.db = null;

dbutils.col = function(collection) {
    return dbutils.db.production.collection(collection)
}

dbutils.colnm = {
    user: 'user',
    workspace: 'wrkspc',
    entity: 'entt',
    zone: 'zone',
    mom: 'mom',
    client: 'client'
}

dbutils.getOne = (colname, filter) => {
    return new Promise((resolve, reject) => {
        dbutils.col(colname).findOne(filter, ((err, docs) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {

                if (docs === null) {
                    resolve(docs)
                    return
                }
                resolve(docs)
            }
        }))
    });
};

dbutils.createIndexes = function() {
    // create index on user collection
    dbutils.col(dbutils.colnm.user).createIndex({
        email: 1
    }, {
        unique: true
    }, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    })
}




module.exports = dbutils;