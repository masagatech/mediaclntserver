const mqtt = require('mqtt');
const dbs = require('../db/dbutils');


module.exports = function() {
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

    client.on('connect', function() { // When connected
        // subscribe to a topic

        client.subscribe('client/connected', function() {
            // when a message arrives, do something with it

            client.on('message', function(topic, message, packet) {
                var apis = JSON.parse(message);
                if (!apis.clientid) {
                    return;
                }
                var newvalues = {
                    $set: {
                        "clientid": apis.clientid,
                        "lastupdate": new Date()
                    }
                };

                dbs.col(dbs.colnm.client).updateOne({
                    clientid: apis.clientid
                }, newvalues, {
                    upsert: true
                }, function(err, res) {
                    console.log(err)
                });
            });
        });

        // maintain online offline status

        client.subscribe('client/+/status', function() {
            // when a message arrives, do something with it

            client.on('message', function(topic, message, packet) {
                var apis = JSON.parse(message);

                if (!apis.clientid) {
                    return;
                }
                if (apis.status === 'offline' && !packet.retain) {

                } else {
                    return;
                }

                var newvalues = {
                    $set: {
                        "clientid": apis.clientid,
                        "offlinetm": new Date(),
                    }
                };

                apis.offlinetm = new Date();

                dbs.col(dbs.colnm.client).updateOne({
                    clientid: apis.clientid
                }, newvalues, {
                    upsert: true
                }, function(err, res) {
                    console.log(err)
                });

                // client.publish(packet.topic, JSON.stringify(apis), {
                //     retain: true
                // }, function () {

                // })
            })
        });
    });
};