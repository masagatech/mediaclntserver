const dbutils = {};

dbutils.db = null;

dbutils.col = function (collection) {
    return dbutils.db.production.collection(collection)
}

dbutils.colnm = {
    user: 'user'
}

module.exports = dbutils;