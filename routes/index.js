const login = require('../controllers/apis/login')

module.exports = function(app) {
    app.post('/login', login.getLogin);
    app.post('/createuser', login.createUser);

    return app
}