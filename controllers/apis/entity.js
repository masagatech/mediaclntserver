const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');

module.exports = entt = {};

entt.saveEntity = function (req, res) {
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

entt.getEntity = function (req, res) {

}