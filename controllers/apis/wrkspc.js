const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');

module.exports = wrkspc = {};

// Validate

function isValidWorkspace(req, res) {
    const params = req.body;

    if (!params.ws_code === '' || params.ws_code.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Workspace Code is Required"));
        return false;
    } else if (!params.ws_name === '' || params.ws_name.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Workspace Name is Required"));
        return false;
    } else if (!params.login_code === '' || params.login_code.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Login Code is Required"));
        return false;
    } else if (!params.pwd === '' || params.pwd.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Password is Required"));
        return false;
    } else if (!params.contact_person === '' || params.contact_person.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Contact Person is Required"));
        return false;
    } else if (!params.mobile === '' || params.mobile.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Mobile is Required"));
        return false;
    } else if (!params.address === '' || params.address.trim() === '') {
        res.json(requtils.res(false, null, "-1", "Address is Required"));
        return false;
    }

    return true;
}

// Insert / Update

wrkspc.saveWorkspace = function(req, res) {
    const isvalid = isValidWorkspace(req, res);

    if (isvalid) {
        const params = req.body;

        dbs.exists(dbs.colnm.workspace, {
            _id: params._id
        }).then((id) => {
            if (id > 0) {
                return Promise.resolve(id);
            } else {
                return dbs.nextid(dbs.colnm.workspace)
            }
        }).then((finalid) => {
            params._id = finalid;

            if (params.isedit == true) {
                params.updatedby = "admin";
                params.updatedon = dbs.getCurrentDate();
            } else {
                params.createdby = "admin";
                params.createdon = dbs.getCurrentDate();
            }

            dbs.col(dbs.colnm.workspace).findOneAndUpdate({
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
}

// Exists

wrkspc.existsWorkspace = function(req, res) {
    dbs.exists(dbs.colnm.workspace, {
        ws_code: new RegExp("^" + req.query.ws_code.toLowerCase(), "i")
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

// Get All Data

wrkspc.getAllWorkspace = function(req, res) {
    dbs.col(dbs.colnm.workspace).find({}, {
        projection: {
            _id: 1,
            ws_code: 1,
            ws_name: 1,
            contact_person: 1,
            mobile: 1,
            email: 1
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

wrkspc.getWorkspaceByID = function(req, res) {
    dbs.col(dbs.colnm.workspace).findOne({ "_id": parseInt(req.query.id) }, function(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }

        res.json(requtils.res(true, result, '', ''))
    })
}