const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');

module.exports = mom = {};

// Insert / Update

mom.saveMOM = function(req, res) {
    const params = req.body;

    dbs.exists(dbs.colnm.mom, {
        _id: params._id
    }).then((id) => {
        if (id > 0) {
            return Promise.resolve(id);
        } else {
            return dbs.nextid(dbs.colnm.entity)
        }
    }).then((finalid) => {
        params._id = finalid;

        if (params.isedit == true) {
            params.updatedon = dbs.getCurrentDate();
        } else {
            params.createdon = dbs.getCurrentDate();
        }

        dbs.col(dbs.colnm.mom).findOneAndUpdate({
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

mom.getMOM = function(req, res) {
    var params = {};

    if (req.query.flag == "bygroup") {
        params = { "group": req.query.group }
    } else {
        params = {}
    }

    dbs.col(dbs.colnm.mom).find(params).toArray(function name(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }
        res.json(requtils.res(true, result, '', ''))
    })
}

// Get Data By ID

mom.getMOMByID = function(req, res) {
    dbs.col(dbs.colnm.mom).findOne({ "_id": parseInt(req.query.id) }, function(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }

        res.json(requtils.res(true, result, '', ''))
    })
}