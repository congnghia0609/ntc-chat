var Config = require('../config/config'),
    conf = new Config();
var Q = require('q');
var jwt = require('jsonwebtoken');
var JWT_SECRET_KEY = conf.JWT_SECRET_KEY; //'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

module.exports.getUserFromToken = function(token) {
    var deferred = Q.defer();
    var user = {};
    try {
        var decoded = jwt.verify(token, JWT_SECRET_KEY);
        user.id = decoded.uid;
        user.email = decoded.email;
        user.name = decoded.name;
        user.type_user = decoded.type_user;
        user.avt = decoded.avt;
        deferred.resolve(user);
    } catch (err) {
        console.log("getUserFromToken: " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};