var Config = require('../config/config'),
    conf = new Config();
var routingKey = conf.rb_key_notify; //'notify';

module.exports = function(chatServer) {

    chatServer.on('sendNotify', function(notify) {
        // var notifyString = JSON.stringify(notify);
        // console.log('Notify_Producer sending notify ' + notifyString);
        var sendMsg = require('./rbProducer.js').sendMsg;
        sendMsg(routingKey, notify);
    });

    return {
        close: function() {
            console.log('Shutting down Notify_Producer...');
        }
    };
};