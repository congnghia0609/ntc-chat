var dataService = require('../lib/data_service');
//
var user_id1 = 1;
var user_id2 = 2;
var room_id = 3;

// 1.1. Test getAllRoomUserByRoomId
dataService.getAllRoomUserByRoomId(room_id).then(function(res) {
    console.log('==================================== Test getAllRoomUserByRoomId');
    console.log(res);
    console.log('====================================');
});

// 1.2. Test addRoomUser
dataService.addRoomUser(room_id, user_id1).then(function(res) {
    console.log('==================================== Test addRoomUser');
    console.log(res);
    console.log('====================================');
});
dataService.getAllRoomUserByRoomId(room_id).then(function(res) {
    console.log('==================================== Result getAllRoomUserByRoomId');
    console.log(res);
    console.log('====================================');
});

// 1.3.1. Test addRoomUser2User
dataService.addRoomUser2User(room_id, user_id1, user_id2).then(function(res) {
    console.log('==================================== Test addRoomUser2User');
    console.log(res);
    console.log('====================================');
});
dataService.getAllRoomUserByRoomId(room_id).then(function(res) {
    console.log('==================================== Result getAllRoomUserByRoomId');
    console.log(res);
    console.log('====================================');
});

// 1.3.2. Test addRoomUser2UserAsync
var user_id1 = 4;
var user_id2 = 5;
var room_id = 6;
dataService.addRoomUser2UserAsync(room_id, user_id1, user_id2).then(function(res) {
    console.log('==================================== Test addRoomUser2UserAsync');
    console.log(res);
    console.log('====================================');
});
dataService.getAllRoomUserByRoomId(room_id).then(function(res) {
    console.log('==================================== Result getAllRoomUserByRoomId');
    console.log(res);
    console.log('====================================');
});

// 1.4. Test removeRoomUser
// dataService.removeRoomUser(room_id).then(function(res) {
//     console.log('==================================== Test removeRoomUser');
//     console.log(res);
//     console.log('====================================');
// });
// dataService.getAllRoomUserByRoomId(room_id).then(function(res) {
//     console.log('==================================== Result getAllRoomUserByRoomId');
//     console.log(res);
//     console.log('====================================');
// });