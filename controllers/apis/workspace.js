const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');
const common = require('../../utils/common');


const async = require("async");

module.exports = wrkspc = {};

wrkspc.getWorkspaceDetails = function(req, res) {
    const params = req.body;

    dbs.getOne(dbs.colnm.workspace, params).then((docs) => {
        res.json(docs);
    }).catch((err) => {
        res.error(err);
    })
}

wrkspc.isValidWorkspace = function(req, res) {
    const params = req.body;

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

    return true;
}

// Insert Workspace
function insertWorkspace(req, res) {
    const params = req.body;

    async.waterfall([
        function(callback) {
            // check workspace code is exists or not

            dbs.getOne(dbs.colnm.workspace, {
                "wscode": params.wscode
            }).then((docs) => {
                callback(null, requtils.res(true, docs, "", null));
            }).catch((err) => {
                callback(null, requtils.res(false, null, "-1", err));
            })
        },

        function(args, callback) {
            if (args.status) {
                if (args.data === null) {
                    // dbs.nextid(dbs.colnm.workspace, function(err, sequence) {
                    dbs.col(dbs.colnm.workspace).insertOne({
                        "wsid": sequence,
                        "wscode": params.wscode,
                        "lgcode": params.lgcode,
                        "lgpwd": params.lgpwd,
                        "wsname": params.wsname,
                        "mobile": params.mobile,
                        "address": params.address,
                        "createdby": params.cuid,
                        "createdon": new Date()
                    }, function(err, res) {
                        if (err) {
                            callback(null, requtils.res(false, null, "-1", "Error while creating workspace, Try later"));
                            return
                        };

                        callback(null, requtils.res(true, null, "1", "Workspace Saved successfully!!!"));
                    });
                    // });
                } else {
                    callback(null, requtils.res(false, null, "106", "Workspace Code is Already Exists"));
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

// Update Workspace
function updateWorkspace(req, res) {
    const params = req.body;

    async.waterfall([
        function(callback) {
            // check workspace code is exists or not

            dbs.getOne(dbs.colnm.workspace, {
                "wsid": '!' + params.wsid,
                "wscode": params.wscode
            }).then((docs) => {
                callback(null, requtils.res(true, docs, "", null));
            }).catch((err) => {
                callback(null, requtils.res(false, null, "-1", err));
            })
        },

        function(args, callback) {
            // check workspace code is exists or not

            if (args.status) {
                // if (args.data === null) {

                var myquery = {
                    "wsid": params.wsid
                }

                var newvalues = {
                    $set: {
                        "lgcode": params.lgcode,
                        "lgpwd": params.lgpwd,
                        "wsname": params.wsname,
                        "mobile": params.mobile,
                        "address": params.address,
                        "updatedby": params.cuid,
                        "updatedon": new Date()
                    }
                };

                dbs.col(dbs.colnm.workspace).updateOne(myquery, newvalues, function(err, res) {
                    if (err) {
                        callback(null, requtils.res(false, null, "-1", "Error while creating workspace, Try later. " + err));
                        return
                    };

                    callback(null, requtils.res(true, null, "1", "Workspace Updated successfully!!!"));
                });

                // } else {
                //     res.json(requtils.res(false, null, "106", "Workspace Code is Already Exists"));
                // }
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

//////////////////////////////////////////////////////////////////////////////////////////////////
wrkspc.saveWorkspaceInfo = function(req, res) {
    const params = req.body;


    dbs.nextid(dbs.colnm.workspace, function(err, sequence) {

        res.json(requtils.res(false, null, "105", "Mobile No is required" + sequence));

    });





}



// Save Workspace
wrkspc.saveWorkspaceInfo1 = function(req, res) {
    const params = req.body;

    var isvalid = wrkspc.isValidWorkspace(req, res);

    if (isvalid) {
        if (params._id == null || params._id == 0) {
            console.log("insert");
            insertWorkspace(req, res);
        } else {
            console.log("update");
            updateWorkspace(req, res);
        }
    }
}