const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');
const common = require('../../utils/common');


const async = require("async");

module.exports = wrkspc = {};

// insert update workspace


wrkspc.saveWrksSpace = function (req, res) {
    dbs.exists(dbs.colnm.workspace, {
        _id: req.body._id
    }).then((id) => {
        if (id > 0) {
            return Promise.resolve(id);
        } else {
            return dbs.nextid(dbs.colnm.workspace)
        }
    }).then((finalid) => {
        req.body._id = finalid;
        dbs.col(dbs.colnm.workspace).findOneAndUpdate({
                _id: finalid
            }, {
                $set: req.body
            }, {
                upsert: true,
                returnOriginal: false
            },
            function (err, result) {
                if (err) {
                    console.log(err);
                    requtils.res(false, null, '0013', err);
                    return;
                };
                console.log(result);
                res.json(requtils.res(true, 'Data saved successfully', '', null));
            });
    }).catch((err) => {
        res.json(requtils.res(false, null, '0013', err));
    })
}

wrkspc.exists = function (req, res) {

    dbs.exists(dbs.colnm.workspace, {
        ws_code :new RegExp("^" + req.query.ws_code.toLowerCase(), "i") 
    }).then((id) => {
        if (id > 0) {
            res.json({
                status: true
            })
        } else {
            res.json({
                status: false
            })
        }
    })
};

wrkspc.getWrksSpace = function (req, res) {

    dbs.col(dbs.colnm.workspace).find({}, {
        projection: {
            pwd: 0,
            email: 0,
            address: 0,
            mobile: 0
        }
    }).toArray(function name(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }
        res.json(requtils.res(true, result, '', ''))
    })
}