const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');

module.exports = usr = {};

var ucodevalid = '';
var emailvalid = '';

// Exists User Code

function isValidUserCode(params) {
    var _ucodevalid = '';

    dbs.exists(dbs.colnm.user, {
        ucode: new RegExp("^" + params.ucode.toLowerCase(), "i")
    }).then((id) => {
        if (id > 0) {
            _ucodevalid = 'Y';
        } else {
            _ucodevalid = 'N';
        }
    })

    ucodevalid = _ucodevalid;
    return ucodevalid;
}

// Exists Email

function isValidEmail(params) {
    var _emailvalid = '';

    dbs.exists(dbs.colnm.user, {
        email: new RegExp("^" + params.email.toLowerCase(), "i")
    }).then((id) => {
        if (id > 0) {
            _emailvalid = 'Y';
        } else {
            _emailvalid = 'N';
        }
    })

    emailvalid = _emailvalid;
    return emailvalid;
}

// Validate

function isValidUser(req, res) {
    const params = req.body;

    if (!params.ucode === '' || params.ucode.trim() === '') {
        res.json(requtils.res(false, null, "-1", "User Code is Required"));
        return false;
    }
    if (!params.pwd === '' || params.pwd.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Password is Required"));
        return false;
    }
    if (!params.full_name === '' || params.full_name.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Full Name is Required"));
        return false;
    }
    if (!params.gender === '' || params.gender.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Gender is Required"));
        return false;
    }
    if (!params.utype === '' || params.utype.trim() === '') {
        res.json(requtils.res(false, null, "-1", "User Type is Required"));
        return false;
    }
    if (!params.mobile === '' || params.mobile.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Mobile is Required"));
        return false;
    }
    if (!params.email === '' || params.email.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Email is Required"));
        return false;
    }

    console.log(isValidUserCode(params));

    if (isValidUserCode(params) === 'Y') {
        res.json(requtils.res(false, null, "-1", "User Code is Already Exists"));
        return false;
    }

    console.log(isValidEmail(params));

    if (isValidEmail(params) === 'Y') {
        res.json(requtils.res(false, null, "-1", "Email is Already Exists"));
        return false;
    }

    return true;
}

// Insert / Update

usr.saveUserInfo = function(req, res) {
    const isvalid = isValidUser(req, res);

    if (isvalid) {
        console.log("success");

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
                    res.json(requtils.res(false, null, '-1', err.errmsg));
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
}

// Get All Data

usr.getUserDetails = function(req, res) {
    var params = {};

    if (req.query.flag == "bywsid") {
        params = { "wsid": parseInt(req.query.wsid) }
    } else {
        params = {}
    }

    // dbs.col(dbs.colnm.user).find(params, {
    //     projection: {
    //         _id: 1,
    //         full_name: 1,
    //         utype: 1,
    //         mobile: 1,
    //         email: 1,
    //         wsid: 1
    //     }
    // })

    dbs.col(dbs.colnm.user).aggregate([{
            "$match": params
        },
        {
            "$lookup": {
                "from": dbs.colnm.mom,
                "localField": "utype",
                "foreignField": "key",
                "as": "utype"
            }
        },
        {
            "$lookup": {
                "from": dbs.colnm.mom,
                "localField": "gender",
                "foreignField": "key",
                "as": "gender"
            }
        }, {
            "$project": {
                "_id": 1,
                "ucode": 1,
                "full_name": 1,
                "mobile": 1,
                "email": 1,
                "wsid": 1,
                "utype.key": 1,
                "utype.val": 1,
                "gender.key": 1,
                "gender.val": 1
            }
        }
    ]).toArray(function name(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }
        res.json(requtils.res(true, result, '', ''))
    })
}

// Get Data By ID

usr.getUserByID = function(req, res) {
    dbs.col(dbs.colnm.user).aggregate([{
            "$match": {
                "_id": parseInt(req.query.id)
            }
        },
        {
            "$lookup": {
                "from": dbs.colnm.entity,
                "localField": "enttids",
                "foreignField": "_id",
                "as": "entity"
            }
        }, {
            "$project": {
                "_id": 1,
                "ucode": 1,
                "pwd": 1,
                "full_name": 1,
                "gender": 1,
                "utype": 1,
                "about_us": 1,
                "mobile": 1,
                "email": 1,
                "address": 1,
                "isallentt": 1,
                "enttids": 1,
                "isallentt": 1,
                "wsid": 1,
                "entity._id": 1,
                "entity.entt_name": 1
            }
        }
    ]).toArray(function name(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }
        res.json(requtils.res(true, result[0], '', ''))
    });

    // .findOne({ "_id": parseInt(req.query.id) }, function(err, result) {
    //     if (err) {
    //         res.json(requtils.res(false, null, '', err))
    //         return;
    //     }

    //     res.json(requtils.res(true, result, '', ''))
    // })
}

// Get User Entity

usr.getUserEntity = function(req, res) {
    dbs.col(dbs.colnm.entity).find({ "_id": { $in: req.query.enttids } }, {
        projection: {
            _id: 1,
            entt_name: 1
        }
    }).toArray(function name(err, result) {
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