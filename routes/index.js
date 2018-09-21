const login = require('../controllers/apis/login');
const wrkspc = require('../controllers/apis/workspace');

module.exports = function(app) {
    // User Register / Login

    app.post('/login', login.getLogin);
    app.post('/registeredUser', login.registeredUser);

    // Workspace

    app.post('/getWorkspaceDetails', wrkspc.getWorkspaceDetails);
    app.post('/saveWorkspaceInfo', wrkspc.saveWorkspaceInfo);

    return app
}