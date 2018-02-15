//@ts-nocheck
var Config = require('../config/config'),
    conf = new Config();
var all = require('bluebird').all;
var amqp = require('amqplib');
var amqpUrl = conf.amqp_url; //'amqp://username:password@localhost:5672/';

exports.startConsumer = function(chatServer, key) {
    // Constant
    var routingKey = key;
    var ex = routingKey;
    var qname = routingKey;
    var arrkey = [];
    arrkey.push(routingKey);

    var open = amqp.connect(amqpUrl);
    open.then(function(conn) {
        // @ts-ignore
        process.once('SIGINT', function() {
            conn.close();
        });

        return conn.createChannel().then(function(ch) {
            var ok = ch.assertExchange(ex, 'topic', { durable: true });

            ok = ok.then(function() {
                return ch.assertQueue(qname, { exclusive: false });
            });

            ok = ok.then(function(qok) {
                var queue = qok.queue;
                return all(arrkey.map(function(rk) {
                    ch.bindQueue(queue, ex, rk);
                })).then(function() {
                    return queue;
                });
            });

            ok = ok.then(function(queue) {
                return ch.consume(queue, processMessage, { noAck: true });
            });

            return ok.then(function() {
                // console.log('====================================');
                // console.log(' [*] Waiting for logs. To exit press CTRL+C...');
                // console.log('====================================');
            });

            function processMessage(msg) {
                // console.log(' [x] consumer recv | %s: %s', msg.fields.routingKey, msg.content.toString());
                if (chatServer) {
                    var message = JSON.parse(msg.content);
                    chatServer.broadcastNotify(message);
                }
            }
        });
    }).catch(console.warn);
}