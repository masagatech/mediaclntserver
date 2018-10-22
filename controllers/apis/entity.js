const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');

module.exports = entt = {};

// Insert / Update

entt.saveEntityInfo = function(req, res) {
    const params = req.body;

    dbs.exists(dbs.colnm.entity, {
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

        dbs.col(dbs.colnm.entity).findOneAndUpdate({
            _id: finalid
        }, {
            $set: params
        }, {
            upsert: true,
            returnOriginal: false
        }, function(err, result) {
            if (err) {
                res.json(requtils.res(false, null, '-1', err));
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

entt.getEntityDetails = function(req, res) {
    var params = {};

    if (req.query.flag == "bywsid") {
        params = { "wsid": parseInt(req.query.wsid) }
    } else {
        params = {}
    }

    dbs.col(dbs.colnm.entity).find(params, {
        projection: {
            _id: 1,
            entt_name: 1,
            contact_person: 1,
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

entt.getEntityByID = function(req, res) {
    dbs.col(dbs.colnm.entity).findOne({ "_id": parseInt(req.query.id) }, function(err, result) {
        if (err) {
            res.json(requtils.res(false, null, '', err))
            return;
        }

        res.json(requtils.res(true, result, '', ''))
    })
}