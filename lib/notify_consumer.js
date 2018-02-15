var Config = require('../config/config'),
    conf = new Config();
var routingKey = conf.rb_key_notify; //'notify';

module.exports = function(chatServer) {
    var startConsumer = require('./rbNotifyConsumer.js').startConsumer;
    startConsumer(chatServer, routingKey);

    return {
        close: function() {
            console.log('Shutting down Notify_Consumer...');
        }
    };
};