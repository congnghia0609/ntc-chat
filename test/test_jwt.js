// var jwt = require('jsonwebtoken');
// var JWT_SECRET_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
// var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlX2F1dGgiOiJ1cCIsImV4cCI6MTUwMjE2NDYwNCwidXNlcm5hbWUiOiJuZ2hpYTJAZ21haWwuY29tIiwidWlkIjoyLCJ0aW1lc3RhbXAiOjE1MDE1NTk4MDQ2MDgsInVzZXJfaWQiOjIsInR5cGVfdXNlciI6ImNhbmRpZGF0ZSIsIm5hbWUiOiJuZ2hpYSB0cmFuIiwiZW1haWwiOiJuZ2hpYTJAZ21haWwuY29tIiwiYXZ0IjoiIn0.j_mITV8Aqa5HD2hOuMzPlEbJxU-mViETsIv555qDmYo";
// //
// try {
//     var decoded = jwt.verify(token, JWT_SECRET_KEY);
//     console.log('==================================== verify');
//     console.log(decoded);
//     console.log('decoded.uid: ' + decoded.uid);
//     console.log('decoded.email: ' + decoded.email);
//     console.log('decoded.name: ' + decoded.name);
//     console.log('decoded.type_user: ' + decoded.type_user);
//     console.log('decoded.avt: ' + decoded.avt);
//     console.log('====================================');
// } catch (err) {
//     // err
// }

// // get the decoded payload ignoring signature, no secretOrPrivateKey needed
// var decoded = jwt.decode(token);
// console.log('==================================== decode');
// console.log(decoded);
// console.log('====================================');


var jwtUtil = require('../lib/jwt_util');
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlX2F1dGgiOiJ1cCIsImV4cCI6MTUwMjE2NDYwNCwidXNlcm5hbWUiOiJuZ2hpYTJAZ21haWwuY29tIiwidWlkIjoyLCJ0aW1lc3RhbXAiOjE1MDE1NTk4MDQ2MDgsInVzZXJfaWQiOjIsInR5cGVfdXNlciI6ImNhbmRpZGF0ZSIsIm5hbWUiOiJuZ2hpYSB0cmFuIiwiZW1haWwiOiJuZ2hpYTJAZ21haWwuY29tIiwiYXZ0IjoiIn0.j_mITV8Aqa5HD2hOuMzPlEbJxU-mViETsIv555qDmYo";
//
jwtUtil.getUserFromToken(token).then(function(user) {
    console.log('==================================== Test JWT');
    console.log(user);
    console.log('====================================');
}).catch(function(err) {
    console.log('==================================== Test JWT ERROR');
    console.log(err);
    console.log('====================================');
});