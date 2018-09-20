const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');
const common = require('../../utils/common')

const async = require("async");

module.exports = wrkspc = {};

wrkspc.getWorkspace = function(req, res) {
    const params = req.body;

    dbs.getOne(dbs.colnm.workspace, params).then((docs) => {
        res.json(docs);
    }).catch((err) => {
        res.error(err);
    })
}

wrkspc.isValidWorkspace = function(params) {
    if (!params.wscode || params.wscode.trim() === '') {
        res.json(requtils.res(false, null, "101", "Workspace Code is required"));
        return false;
    }
    if (!params.lgcode || params.lgcode.trim() === '') {
        res.json(requtils.res(false, null, "102", "Login Code is required"));
        return false;
    }
    if (!params.lgpwd || params.lgpwd.trim() === '') {
        res.json(requtils.res(false, null, "103", "Password is required"));
        return false;
    }
    if (!params.wsname || params.wsname.trim() === '') {
        res.json(requtils.res(false, null, "104", "Workspace Name is required"));
        return false;
    }
    if (!params.mobile || params.mobile.trim() === '') {
        res.json(requtils.res(false, null, "105", "Mobile No is required"));
        return false;
    }

    // async.waterfall([
    //     function(args, callback) {
    //         // check workspace code is exists or not

    //         dbs.getOne(dbs.colnm.workspace, {
    //             "wscode": params.wscode
    //         }).then((docs) => {
    //             callback(null, requtils.res(true, docs, "", null));
    //         }).catch((err) => {
    //             callback(null, requtils.res(false, null, "-1", err));
    //         })

    //         if (args.data === null) {
    //             res.json(requtils.res(false, null, "106", "Workspace Code is Already Exists"));
    //             return false;
    //         }
    //     }
    // ]);

    return true;
}

// Save Workspace

wrkspc.saveWorkspace = function(req, res) {
    const params = req.body;

    var isvalid = wrkspc.isValidWorkspace(params);

    if (isvalid) {
        async.waterfall([
            function(callback) {
                // check wprkspace code is exists or not

                dbs.getOne(dbs.colnm.workspace, {
                    "_id": params._id
                }).then((docs) => {
                    callback(null, requtils.res(true, docs, "", null));
                }).catch((err) => {
                    callback(null, requtils.res(false, null, "-1", err));
                })
            },

            function(args, callback) {
                if (args.status) {
                    if (args.data === null) {
                        dbs.col(dbs.colnm.workspace).insertOne(params, function(err, res) {
                            if (err) {
                                callback(null, requtils.res(false, null, "-1", "Error while creating workspace, Try later"));
                                return
                            };

                            callback(null, requtils.res(true, null, "1", "Workspace Saved successfully!!!"));
                        });
                    } else {
                        var ObjectID = require('mongodb').ObjectID;
                        var myquery = { "_id": ObjectID(params._id) };
                        var newvalues = { $set: params };

                        dbs.col(dbs.colnm.workspace).updateOne(myquery, newvalues, function(err, res) {
                            if (err) {
                                callback(null, requtils.res(false, null, "-1", "Error while creating workspace, Try later"));
                                return
                            };

                            callback(null, requtils.res(true, null, "1", "Workspace Updated successfully!!!"));
                        });
                    }
                } else {
                    callback(null, args);
                }
            },
        ], function(err, result) {
            if (err) {
                res.json(err)
                return
            }
            res.json(result);
        })
    }
}