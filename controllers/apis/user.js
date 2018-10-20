const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');

module.exports = usr = {};

// Insert / Update

usr.saveUserInfo = function(req, res) {
    const params = req.body;

    dbs.exists(dbs.colnm.user, {
        _id: params._id
    }).then((id) => {
        if (id > 0) {
            return Promise.resolve(id);
        } else {
            return dbs.nextid(dbs.colnm.user)
        }
    }).then((finalid) => {
        params._id = finalid;

        if (params.isedit == true) {
            params.updatedon = dbs.getCurrentDate();
        } else {
            params.createdon = dbs.getCurrentDate();
        }

        dbs.col(dbs.colnm.user).findOneAndUpdate({
            _id: finalid
        }, {
            $set: params
        }, {
            upsert: true,
            returnOriginal: false
        }, function(err, result) {
            if (err) {
                requtils.res(false, null, '-1', err);
                return;
            };

            if (params.isedit == true) {
                res.json(requtils.res(true, result, '2', 'Data updated successfully'));
            } else {
                res.json(requtils.res(true, result, '1', 'Data saved successfully'));
            }
        });
    }).catch((err) => {
        res.json(requtils.res(false, null, '-1', err));
    })
}

// Get All Data

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://127.0.0.1:27017/";

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;

//     dbs.col(dbs.colnm.user).aggregate([{
//         $lookup: {
//             from: dbs.colnm.mom,
//             localField: 'gender',
//             foreignField: 'key',
//             as: 'userdetails'
//         }
//     }]).toArray(function(err, res) {
//         if (err) throw err;
//         console.log(JSON.stringify(res));
//     });
// });

usr.getUserDetails = function(req, res) {
    var params = {};

    if (req.query.flag == "bywsid") {
        params = { "wsid": parseInt(req.query.wsid) }
    } else {
        params = {}
    }

    dbs.col(dbs.colnm.user).find(params, {
        projection: {
            _id: 1,
            full_name: 1,
            utype: 1,
            mobile: 1,
            email: 1,
            wsid: 1
        }
    }).toArray(function name(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }
        res.json(requtils.res(true, result, '', ''))
    })
}

// Get Data By ID

usr.getUserByID = function(req, res) {
    dbs.col(dbs.colnm.user).findOne({ "_id": parseInt(req.query.id) }, function(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }

        res.json(requtils.res(true, result, '', ''))
    })
}

// Get DropDown Data

usr.getUserDropDown = function(req, res) {
    dbs.col(dbs.colnm.mom).find({ "group": { $in: ["gender", "usertype"] } }, {
        projection: {
            key: 1,
            val: 1,
            group: 1
        }
    }).toArray(function name(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }
        res.json(requtils.res(true, result, '', ''))
    })
}