#!/usr/bin/env node
 //@ts-nocheck
var Config = require('../config/config'),
    conf = new Config();
var amqp = require('amqplib');
var amqpUrl = conf.amqp_url; //'amqp://username:password@localhost:5672/';

exports.sendMsg = function(key, message) {
    var open = amqp.connect(amqpUrl);
    // Constant.
    var routingKey = key;
    var ex = routingKey;
    var qname = routingKey;

    // Publisher.
    open.then(function(conn) {
        return conn.createChannel().then(function(ch) {
            var ok = ch.assertExchange(ex, 'topic', { durable: true });

            ok = ok.then(function() {
                return ch.assertQueue(qname, { exclusive: false });
            });

            return ok.then(function() {
                var messageString = JSON.stringify(message);
                ch.publish(ex, routingKey, new Buffer(messageString));
                // console.log('====================================');
                // console.log(" [x] producer send | %s: %s", routingKey, messageString);
                // console.log('====================================');
                return ch.close();
            });
        }).finally(function() {
            conn.close();
        });
    }).catch(console.warn);
}