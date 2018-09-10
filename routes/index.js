const login = require('../controllers/apis/login')

module.exports = function (app) {
    app.get('/login', login.getlogin);



    return app
}