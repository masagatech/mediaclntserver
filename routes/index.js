var common = require('../controllers/apis/common');
var login = require('../controllers/apis/login');
var wrkspc = require('../controllers/apis/wrkspc');
var user = require('../controllers/apis/user');
var entity = require('../controllers/apis/entity');
var clients = require('../controllers/apis/clients');
var zone = require('../controllers/apis/zone');

module.exports = function(app) {
    // MOM

    app.post('/saveMOM', common.saveMOM);
    app.get('/getMOM', common.getMOM);
    app.get('/getMOMByID', common.getMOMByID);

    app.get('/getAutoData', common.getAutoData);

    // User Register / Login

    app.post('/login', login.getLogin);
    app.post('/registeredUser', login.registeredUser);

    // Workspace

    app.post('/saveWorkspaceInfo', wrkspc.saveWorkspaceInfo);
    app.get('/existsWorkspace', wrkspc.existsWorkspace);
    app.get('/getWorkspaceDetails', wrkspc.getWorkspaceDetails);
    app.get('/getWorkspaceByID', wrkspc.getWorkspaceByID);

    // User

    app.post('/saveUserInfo', user.saveUserInfo);
    app.get('/getUserDetails', user.getUserDetails);
    app.get('/getUserByID', user.getUserByID);
    app.get('/getUserEntity', user.getUserEntity);
    app.get('/getUserDropDown', user.getUserDropDown);

    // Entity

    app.post('/saveEntityInfo', entity.saveEntityInfo);
    app.get('/getEntityDetails', entity.getEntityDetails);
    app.get('/getEntityByID', entity.getEntityByID);

    // Zone

    app.post('/saveZoneInfo', zone.saveZoneInfo);
    app.get('/getZoneDetails', zone.getZoneDetails);
    app.get('/getZoneByID', zone.getZoneByID);

    // Client

    app.get('/getClients', clients.getClients);
    app.get('/getClientDetails', clients.getClientDetails);
    app.post('/registerClient', clients.registerClient);
    app.post('/updateClient', clients.updateClient);

    return app;
}