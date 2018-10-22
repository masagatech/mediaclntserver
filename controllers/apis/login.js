const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');
const common = require('../../utils/common')

const async = require("async");

module.exports = login = {};

// Get Login

login.getLogin = function(req, res) {
    const params = req.body;

    if (!params.code || params.code.trim() === '') {
        res.json(requtils.res(false, null, "91", "Code is required"));
        return;
    } else if (!params.pwd || params.pwd.trim() === '') {
        res.json(requtils.res(false, null, "92", "Password is required"));
        return;
    }

    dbs.getOneProj(dbs.colnm.user, {
        'code': params.code
    }, {
        projection: {
            code: 1,
            pwd: 1,
            full_name: 1,
            email: 1,
            utype: 1,
            wsid: 1,
            status: 1
        }
    }).then((docs) => {
        var data = {};

        if (docs === null) {
            res.json(requtils.res(false, null, "93", "Invalid Login"));
            return;
        }

        if (params.pwd.trim() !== docs.pwd) {
            res.json(requtils.res(false, null, "94", "Invalid Login"));
            return;
        }

        data = {
            "status": true,
            "data": docs
        }

        res.json(data);
    }).catch((err) => {
        res.error(err);
    })
}

// Registered User

login.registeredUser = function(req, res) {
    const params = req.body;

    if (!params.name || params.name.trim() === '') {
        res.json(requtils.res(false, null, "91", "Full Name is required"));
        return;
    }
    if (!params.email || params.email.trim() === '') {
        res.json(requtils.res(false, null, "92", "Email is required"));
        return;
    }
    if (!common.isValidEmail(params.email)) {
        res.json(requtils.res(false, null, "93", "Please enter a valid email address"));
        return;
    }
    if (!params.pwd || params.pwd.trim() === '') {
        res.json(requtils.res(false, null, "94", "Password is required"));
        return;
    }

    async.waterfall([
        function(callback) {
            // check user is exists or not

            dbs.getOne(dbs.colnm.user, {
                "email": params.email
            }).then((docs) => {
                callback(null, requtils.res(true, docs, "", null));
            }).catch((err) => {
                callback(null, requtils.res(false, null, "-1", err));
            })
        },

        function(args, callback) {
            if (args.status) {
                if (args.data === null) {
                    dbs.col(dbs.colnm.user).insertOne(params, function(err, res) {
                        if (err) {
                            callback(null, requtils.res(false, null, "-1", "Error while creating user, Try later"));
                            return
                        };

                        callback(null, requtils.res(true, null, "1", "User registered successfully!!!"));

                        common.sendMail({
                            from: '"Media Client"',
                            to: params.email,
                            subject: 'User Registration',
                            html: `
                                <center><b>***ACTION REQUIRED***</b></center>
                                <p>To activate your account (and prove you’re not a spam bot), please click this link:</p>
                                <p><a href="">https://greensock.com/forums/index.php?app=core&module=global&section=register&do=auto_validate&uid=49614&aid=b0020fb425fefbe98029cc30f62d755f</a></p>
                                <p>Your GreenSock account gets you get access to CustomEase, our support forums, important email notifications, and animation superpowers (okay, that last one requires a little effort on your part). 

                                You're well on your way to boosting your animation skills to the next level. Happy tweening!

                                Team GreenSock
                                </p>
                            `
                        });
                    });
                } else {
                    callback(null, requtils.res(false, null, "95", "Email is Already Exists"));
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