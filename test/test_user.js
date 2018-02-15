var dataService = require('../lib/data_service');
var jwtUtil = require('../lib/jwt_util');
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlX2F1dGgiOiJ1cCIsImV4cCI6MTUwMjE2NDYwNCwidXNlcm5hbWUiOiJuZ2hpYTJAZ21haWwuY29tIiwidWlkIjoyLCJ0aW1lc3RhbXAiOjE1MDE1NTk4MDQ2MDgsInVzZXJfaWQiOjIsInR5cGVfdXNlciI6ImNhbmRpZGF0ZSIsIm5hbWUiOiJuZ2hpYSB0cmFuIiwiZW1haWwiOiJuZ2hpYTJAZ21haWwuY29tIiwiYXZ0IjoiIn0.j_mITV8Aqa5HD2hOuMzPlEbJxU-mViETsIv555qDmYo";

// 1.1. Test setUser.
// jwtUtil.getUserFromToken(token).then(function(user) {
//     console.log('==================================== getUserFromToken');
//     console.log(user);
//     console.log('====================================');
//     dataService.setUser(user).then(function(user) {
//         console.log('==================================== Test setUser');
//         console.log(user);
//         console.log('====================================');
//     });
// }).catch(function(err) {
//     console.log('==================================== getUserFromToken ERROR');
//     console.log(err);
//     console.log('====================================');
// });

// 1.2. Test setUserAsync.
// jwtUtil.getUserFromToken(token).then(function(user) {
//     console.log('==================================== getUserFromToken');
//     console.log(user);
//     console.log('====================================');
//     user.avt = "https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
//     dataService.setUserAsync(user).then(function(user) {
//         console.log('==================================== Test setUserAsync');
//         console.log(user);
//         console.log('====================================');
//     });
// }).catch(function(err) {
//     console.log('==================================== getUserFromToken ERROR');
//     console.log(err);
//     console.log('====================================');
// });

// 1.3. Test getUser id=2
var user_id = 2;
dataService.getUser(user_id).then(function(user) {
    console.log('==================================== Test getUser=' + user_id);
    console.log(user);
    console.log('====================================');
});