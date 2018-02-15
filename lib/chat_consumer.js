var Config = require('../config/config'),
    conf = new Config();
var routingKey = conf.rb_key_chat; //'chat';

module.exports = function(chatServer) {
    var startConsumer = require('./rbConsumer.js').startConsumer;
    startConsumer(chatServer, routingKey);

    return {
        close: function() {
            console.log('Shutting down Chat_Consumer...');
        }
    };
};