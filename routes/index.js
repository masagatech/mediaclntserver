const login = require('../controllers/apis/login');
const wrkspc = require('../controllers/apis/wrkspc');
const entity = require('../controllers/apis/entity');
const clients = require('../controllers/apis/clients');

module.exports = function(app) {
    // User Register / Login

    app.post('/login', login.getLogin);
    app.post('/registeredUser', login.registeredUser);

    // Workspace

    app.post('/saveWorkspace', wrkspc.saveWorkspace);
    app.get('/existsWorkspace', wrkspc.existsWorkspace);
    app.get('/getAllWorkspace', wrkspc.getAllWorkspace);
    app.get('/getWorkspaceByID', wrkspc.getWorkspaceByID);

    // Entity

    app.post('/saveEntity', entity.saveEntity);
    app.get('/getEntity', entity.getEntity);

    //client

    app.get('/getClients', clients.getClients);
    app.get('/getClientDetails', clients.getClientDetails);
    app.post('/registerClient', clients.registerClient);
    app.post('/updateClient', clients.updateClient);

    return app
}