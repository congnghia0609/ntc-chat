var Config = require('../config/config'),
    conf = new Config();

//
console.log('====================================' + process.env.NODE_ENV);
console.log(conf.port);
console.log('====================================');