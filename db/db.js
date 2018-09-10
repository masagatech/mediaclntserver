const MongoClient = require('mongodb').MongoClient

const PROD_URI = "mongodb://localhost:27017/mdcl"

function connect(url) {
    return MongoClient.connect(url).then(client => client.db())
}

module.exports = async function () {
    let databases = await Promise.all([connect(PROD_URI)])
    return {
        production: databases[0]
    }
}