const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');


module.exports = clients = {};


clients.getClients = function (req, res) {
    const params = req.query || {};

    dbs.col(dbs.colnm.client).find(params, {
        projection: {
            name: 1,
            clientid: 1
        }
    }).toArray(function name(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }
        res.json(requtils.res(true, result, '', ''))
    })
}


clients.getClientDetails = function (req, res) {
    const params = req.query || {};

    dbs.col(dbs.colnm.client).findOne(params, {
        projection: {
            name: 1,
            clientid: 1,
            offlinetm: 1,
            state: 1,
        }
    }, function name(err, result) {
        console.log(err)
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }
        res.json(requtils.res(true, result, '', ''))
    })
}

clients.registerClient = function (req, ress) {
    const params = req.body || {};

    const query = {
        "clientid": params.clientid
    }

    dbs.col(dbs.colnm.client).updateOne(query, {
        "$set": params
    }, {
        upsert: true
    }, function name(err, res) {
        if (err) {
            ress.json(requtils.res(false, null, 'code001', err))
            return;
        }
        ress.json(requtils.res(true, "Registered Successfully", '', ''))
    });
}

clients.updateClient = function (req, ress) {
    const params = req.body || {};

    if (!params.clientid) {
        ress.json(requtils.res(false, null, "91", "ClientId is required"));
        return;
    }


    const query = {
        "clientid": params.clientid
    }

    dbs.col(dbs.colnm.client).updateOne(query, {
        "$set": params
    }, {
        upsert: true
    }, function name(err, res) {
        if (err) {
            ress.json(requtils.res(false, null, 'code002', err))
            return;
        }
        ress.json(requtils.res(true, "Updated Successfully", '', ''))
    });
}