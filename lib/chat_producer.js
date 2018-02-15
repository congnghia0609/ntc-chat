var Config = require('../config/config'),
    conf = new Config();
var routingKey = conf.rb_key_chat; //'chat';

module.exports = function(chatServer) {

    chatServer.on('sendMessage', function(message) {
        // var messageString = JSON.stringify(message);
        // console.log('Chat_Producer sending message ' + messageString);
        var sendMsg = require('./rbProducer.js').sendMsg;
        sendMsg(routingKey, message);
    });

    return {
        close: function() {
            console.log('Shutting down Chat_Producer...');
        }
    };
};