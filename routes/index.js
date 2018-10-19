var login = require('../controllers/apis/login');
var wrkspc = require('../controllers/apis/wrkspc');
var entity = require('../controllers/apis/entity');
var clients = require('../controllers/apis/clients');

module.exports = function(app) {
    // User Register / Login

    app.post('/login', login.getLogin);
    app.post('/registeredUser', login.registeredUser);

    // Workspace

    app.post('/saveWorkspaceInfo', wrkspc.saveWorkspaceInfo);
    app.get('/existsWorkspace', wrkspc.existsWorkspace);
    app.get('/getWorkspaceDetails', wrkspc.getWorkspaceDetails);
    app.get('/getWorkspaceByID', wrkspc.getWorkspaceByID);

    // Entity

    app.post('/saveEntityInfo', entity.saveEntityInfo);
    app.get('/getEntityDetails', entity.getEntityDetails);
    app.get('/getEntityByID', entity.getEntityByID);

    // Client

    app.get('/getClients', clients.getClients);
    app.get('/getClientDetails', clients.getClientDetails);
    app.post('/registerClient', clients.registerClient);
    app.post('/updateClient', clients.updateClient);

    return app;
}