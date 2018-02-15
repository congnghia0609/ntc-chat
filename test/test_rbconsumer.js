var routingKey = 'chat';
var startConsumer = require('../lib/rbConsumer.js').startConsumer;

startConsumer(null, routingKey);