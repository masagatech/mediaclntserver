const login = require('../controllers/apis/login');
const wrkspc = require('../controllers/apis/wrkspc');
const entity = require('../controllers/apis/entity');
const clients = require('../controllers/apis/clients');

module.exports = function (app) {
    // User Register / Login

    app.post('/login', login.getLogin);
    app.post('/registeredUser', login.registeredUser);

    // Workspace
    app.get('/getWrkspace', wrkspc.getWrksSpace);
    app.post('/saveWrkspace', wrkspc.saveWrksSpace);
    app.get('/wrkspcExists', wrkspc.exists);

    // Workspace
    app.get('/getEntity', entity.getEntity);
    app.post('/saveEntity', entity.saveEntity);

    //client
    app.get('/getClients', clients.getClients);
    app.get('/getClientDetails', clients.getClientDetails);
    app.post('/registerClient', clients.registerClient);
    app.post('/updateClient', clients.updateClient);

    return app
}