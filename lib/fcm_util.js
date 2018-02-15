var Config = require('../config/config'),
    conf = new Config();
var Q = require('q');
var FCM = require('fcm-node');
// var serverKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var serverKey = conf.firebase_server_key;
var fcm = new FCM(serverKey);

module.exports.sendNotify = function(data) {
    var deferred = Q.defer();
    var message = {};
    try {
        message.to = data.fcm_token;
        message.content_available = true;
        message.priority = "high";
        message.time_to_live = 2419200; // default 28 days == 2,419,200 seconds == MAX_TIME
        message.notification = data.notification;
        fcm.send(message, function(err, res) {
            if (err) {
                console.log("FCM Something has gone wrong!");
                deferred.reject(err);
            } else {
                // console.log("FCM Successfully sent with response: ", res);
                deferred.resolve(res);
            }
        });
    } catch (err) {
        console.log("sendNotify: " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};