const mqtt = require('mqtt');
const dbs = require('./db/dbutils');


module.exports = function () {
    var options = {
        port: 1883,
        host: 'mqtt://traveltrack.goyo.in',
        username: 'xxxxxxxxxxxxxxxxxx',
        password: 'xxxxxxxxxxxxxxxxxx',
        keepalive: 60,
        reconnectPeriod: 1000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        encoding: 'utf8',
    };

    var client = mqtt.connect('mqtt://traveltrack.goyo.in', options)

    client.on('connect', function () { // When connected
        console.log('connected');
        // subscribe to a topic
        client.subscribe('client/connected', function () {
            // when a message arrives, do something with it
            client.on('message', function (topic, message, packet) {
                var apis = JSON.parse(message);
                dbs.col(dbs.colnm.user).insertOne(apis, function (err, res) {


                });
                //console.log("Received '" + message + "' on '" + topic + "'");
            });
        });
    });
};