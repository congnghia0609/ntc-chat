// @ts-nocheck
var Config = require('./config/config'),
    conf = new Config();
var chat_server = require('./lib/chat_server');
var chat_consumer = require('./lib/chat_consumer');
var chat_producer = require('./lib/chat_producer');
var notify_consumer = require('./lib/notify_consumer');
var notify_producer = require('./lib/notify_producer');
var http = require('http');
var express = require('express');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var data_service = require('./lib/data_service');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');


var app = express();

// all environments
app.set('port', process.env.PORT || conf.port);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.get('/rooms', function(req, res) {
    data_service.getAllRoom().then(function(rooms) {
        data_service.getTotalRoom().then(function(total) {
            res.json({
                'rooms': rooms,
                'total': total
            });
        }).catch(function(err) {
            console.log(err);
        })
    }).catch(function(err) {
        console.log(err);
    })
});

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

console.log('Using arguments ' + JSON.stringify(argv));
var server = http.createServer(app);
var port = (argv.port) ? argv.port : conf.port;
console.log('==================================== ntc-Chat');
console.log('Server read config environment: ' + process.env.NODE_ENV);
console.log('Server express is running on port: ' + port);
console.log('====================================');
server.listen(port);
chatServer = chat_server(server);
chatConsumer = chat_consumer(chatServer);
chatProducer = chat_producer(chatServer);
notifyConsumer = notify_consumer(chatServer);
notifyProducer = notify_producer(chatServer);

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function() {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", function() {
    console.log('Shutting down');
    chatConsumer.close();
    chatProducer.close();
    notifyConsumer.close();
    notifyProducer.close();
    data_service.close();
    process.exit();
});