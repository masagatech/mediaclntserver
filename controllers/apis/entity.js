const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');

module.exports = entt = {};

entt.saveEntity = function(req, res) {
    dbs.exists(dbs.colnm.entity, {
        _id: req.body._id
    }).then((id) => {
        if (id > 0) {
            return Promise.resolve(id);
        } else {
            return dbs.nextid(dbs.colnm.entity)
        }
    }).then((finalid) => {
        req.body._id = finalid;

        dbs.col(dbs.colnm.entity).findOneAndUpdate({
            _id: finalid
        }, {
            $set: req.body
        }, {
            upsert: true,
            returnOriginal: false
        }, function(err, result) {
            if (err) {
                console.log(err);
                requtils.res(false, null, '-1', err);
                return;
            };

            console.log(result);

            if (finalid == 0) {
                res.json(requtils.res(true, result, '1', 'Data saved successfully'));
            } else {
                res.json(requtils.res(true, result, '2', 'Data updated successfully'));
            }
        });
    }).catch((err) => {
        res.json(requtils.res(false, null, '-1', err));
    })
}

entt.getEntity = function(req, res) {

}