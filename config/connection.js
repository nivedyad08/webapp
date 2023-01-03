const { Collection } = require('mongodb')

var MongoClient = require('mongodb').MongoClient
let dbconn = undefined
module.exports.connect = function () {
    const url = 'mongodb://localhost:27017'
    const dbname = 'project'
    MongoClient.connect(url, function (err, client) {
        if (!err)
            dbconn = client.db(dbname)
    })
}
module.exports.conn = () => dbconn
