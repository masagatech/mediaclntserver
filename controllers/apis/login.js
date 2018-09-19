const dbs = require('../../db/dbutils');
const requtils = require('../../utils/requtil');
const common = require('../../utils/common')

const async = require("async");

module.exports = login = {};

login.getLogin = function (req, res) {
    dbs.getOne(dbs.colnm.user, req.body).then((docs) => {
        res.json(docs);
    }).catch((err) => {
        res.error(err);
    })
}


login.createUser = function (req, res) {
    // required parameters
    const params = req.body;

   

    if (!params.email || params.email.trim() === '') {
        res.json(requtils.res(false, null, "91", "Email is required"));
        return;
    } else if (!params.pwd || params.pwd.trim() === '') {
        res.json(requtils.res(false, null, "92", "Password is required"));
        return;
    } else if (!params.name || params.name.trim() === '') {
        res.json(requtils.res(false, null, "92", "Name is required"));
        return;
    }


    async.waterfall([
        function (callback) {
            // check user is exists or not
            dbs.getOne(dbs.colnm.user, {
                "email": req.body.email
            }).then((docs) => {
                callback(null, requtils.res(true, docs, "", null));
            }).catch((err) => {
                callback(null, requtils.res(false, null, "01", err));
            })
        },
        function (args, callback) {
            if (args.status) {
                if (args.data === null) {
                    dbs.col(dbs.colnm.user).insertOne(req.body, function (err, res) {
                        if (err) {
                            callback(null, requtils.res(false, null, "02", "Error while creating user, Try later"));
                            return
                        };
                        callback(null, requtils.res(true, null, "05", "User created successfully!!!"));

                        common.sendMail({
                            from : '"Media Client"',
                            to : 'pratikway.90@gmail.com',
                            subject: 'User Registration',
                            html : `
                                <center><b>***ACTION REQUIRED***</b></center>
                                <p>To activate your account (and prove you’re not a spam bot), please click this link:</p>
                                <p><a href="">https://greensock.com/forums/index.php?app=core&module=global&section=register&do=auto_validate&uid=49614&aid=b0020fb425fefbe98029cc30f62d755f</a></p>
                                <p>Your GreenSock account gets you get access to CustomEase, our support forums, important email notifications, and animation superpowers (okay, that last one requires a little effort on your part). 
                    
                                You're well on your way to boosting your animation skills to the next level. Happy tweening!
                                
                                Team GreenSock
                                </p>
                            `
                        });



                        console.log("Number of documents inserted: " + res.insertedCount);
                    });
                } else {
                    callback(null, requtils.res(false, null, "03", "Already Exists"));
                }
            } else {
                callback(null, args);
            }
        },
    ], function (err, result) {
        if (err) {
            res.json(err)
            return
        }
        res.json(result)
        console.log('this is last function ', result)
    })
}