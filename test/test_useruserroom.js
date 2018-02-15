var dataService = require('../lib/data_service');
//
var user_id1 = 1;
var user_id2 = 2;
var room_id = 3;

// 1.1.1. Test setUserUserRoom
dataService.setUserUserRoom(user_id1, user_id2, room_id).then(function(res) {
    console.log('==================================== Test setUserUserRoom');
    console.log(res);
    console.log('====================================');
});

// 1.1.2. Test setUserUserRoomAsync
var user_id1 = 4;
var user_id2 = 5;
var room_id = 6;
dataService.setUserUserRoomAsync(user_id1, user_id2, room_id).then(function(res) {
    console.log('==================================== Test setUserUserRoomAsync');
    console.log(res);
    console.log('====================================');
});

// 1.2. Test getUserUserRoom
dataService.getUserUserRoom(user_id1, user_id2).then(function(room_id) {
    console.log('==================================== Test getUserUserRoom');
    console.log(room_id);
    console.log('====================================');
});
dataService.getUserUserRoom(user_id2, user_id1).then(function(room_id) {
    console.log('==================================== Test getUserUserRoom');
    console.log(room_id);
    console.log('====================================');
});

// 1.3. Test removeUserUserRoom
// dataService.removeUserUserRoom(user_id1, user_id2).then(function(res) {
//     console.log('==================================== Test removeUserUserRoom');
//     console.log(res);
//     console.log('====================================');
// });
// dataService.getUserUserRoom(user_id1, user_id2).then(function(room_id) {
//     console.log('==================================== Result getUserUserRoom');
//     console.log(room_id);
//     console.log('====================================');
// });
// dataService.getUserUserRoom(user_id2, user_id2).then(function(room_id) {
//     console.log('==================================== Result getUserUserRoom');
//     console.log(room_id);
//     console.log('====================================');
// });