//@ts-check

// var RBProducer = require('../lib/rabbit_producer.js');
// var routingKey = 'chat';
// var amqpUrl = 'amqp://username:password@localhost:5672/';
// producer = new RBProducer(routingKey, amqpUrl);
// var message = { fromUId: 1, toUId: 2, msg: "U1 hello U2..." };
// producer.sendMsg(message);

// Test 
var routingKey = 'chat';
var message = { fromUId: 1, toUId: 2, msg: "U1 hello U2..." };
var amqpUrl = 'amqp://username:password@localhost:5672/';

// @ts-ignore
var sendMsg = require('../lib/rbProducer.js').sendMsg;
sendMsg(routingKey, message);