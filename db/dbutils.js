const Promise = require("bluebird");
const mongoobj = require('mongodb').ObjectID;
var mongoSequence = require('mongo-sequence');

const dbutils = {};

dbutils.db = null;


dbutils.col = function (collection) {
    return dbutils.db.production.collection(collection)
}

dbutils.nextid = function (collection, callback) {

    return new Promise((resolve, reject) => {
        dbutils.col('sequence').findOneAndUpdate({
                _id: collection
            }, {
                $inc: {
                    seq: 1
                }
            }, {
                upsert: true,
                returnOriginal: false
            },
            function (err, result) {
                if (err) reject(err);
                resolve(result.value.seq);
            });
    });
}

dbutils.exists = function (collection, query) {

    return new Promise((resolve, reject) => {
        dbutils.col(collection).findOne(query,
            function (err, result) {

                if (err) reject(err);
                console.log(result)
                resolve((result !== null ? result._id : 0));
            });
    });
}

dbutils.OBJID = function (id) {
    return new mongoobj(id);
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

    return preGetOne(colname, filter);
};


dbutils.getOneProj = (colname, filter, projection) => {

    return preGetOne(colname, filter, projection);
};

function preGetOne(colname, filter, projection) {
    return new Promise((resolve, reject) => {
        dbutils.col(colname).findOne(filter, projection, ((err, docs) => {
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
}

dbutils.createIndexes = function () {
    // create index on user collection
    dbutils.col(dbutils.colnm.user).createIndex({
        email: 1
    }, {
        unique: true
    }, function (err, result) {
        if (err) {
            //   console.log(err);
            return;
        }
        // console.log(result);
    });

    dbutils.col(dbutils.colnm.client).createIndex({
        clientid: 1
    }, {
        unique: true
    }, function (err, result) {
        if (err) {
            //   console.log(err);
            return;
        }
        // console.log(result);
    });
}




module.exports = dbutils;