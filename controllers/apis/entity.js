const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');

module.exports = entt = {};

// Insert / Update

entt.saveEntity = function(req, res) {
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
            params.updatedby = "admin";
            params.updatedon = dbs.getCurrentDate();
        } else {
            params.createdby = "admin";
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

entt.getEntity = function(req, res) {

}