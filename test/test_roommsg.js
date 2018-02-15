var dataService = require('../lib/data_service');
//
// 1.1. Test getRoomMsgByRoomId
// var room_id = 1;
// dataService.getRoomMsgByRoomId(room_id).then(function(res) {
//     console.log('==================================== Test getRoomMsgByRoomId');
//     console.log(res);
//     console.log('====================================');
// });

// 1.2. Test addRoomMsg
var room_id = 1;
var msg_id = 2;
dataService.addRoomMsg(room_id, msg_id).then(function(res) {
    console.log('==================================== Test addRoomMsg');
    console.log(res);
    console.log('====================================');
});
var msg_id = 1;
dataService.addRoomMsg(room_id, msg_id).then(function(res) {
    console.log('==================================== Test addRoomMsg');
    console.log(res);
    console.log('====================================');
});

// 1.3. Test getRoomMsgByRoomId
var room_id = 1;
dataService.getAllRoomMsgByRoomId(room_id).then(function(res) {
    console.log('==================================== Test getRoomMsgByRoomId');
    console.log(res);
    console.log('====================================');
});

// 1.4. Test totalRoomMsgByRoomId
var room_id = 1;
dataService.totalRoomMsgByRoomId(room_id).then(function(res) {
    console.log('==================================== Test totalRoomMsgByRoomId');
    console.log(res);
    console.log('====================================');
});

// 1.5. Test removeRoomMsgByRoomId
dataService.removeRoomMsgByRoomId(room_id, msg_id).then(function(res) {
    console.log('==================================== Test removeRoomMsgByRoomId');
    console.log(res);
    console.log('====================================');
});
dataService.getAllRoomMsgByRoomId(room_id).then(function(res) {
    console.log('==================================== Result removeRoomMsgByRoomId');
    console.log(res);
    console.log('====================================');
});

// 1.6. Test existRoomMsgByRoomId
dataService.existRoomMsgByRoomId(room_id, msg_id).then(function(res) {
    console.log('==================================== Test existRoomMsgByRoomId');
    console.log(res);
    console.log('====================================');
});
var msg_id = 2;
dataService.existRoomMsgByRoomId(room_id, msg_id).then(function(res) {
    console.log('==================================== Test existRoomMsgByRoomId');
    console.log(res);
    console.log('====================================');
});

// 1.7. Test slideRoomMsgByRoomId
var start = 0;
var end = 3;
dataService.slideRoomMsgByRoomId(room_id, start, end).then(function(res) {
    console.log('==================================== Test slideRoomMsgByRoomId');
    console.log(res);
    console.log('====================================');
});
dataService.getAllRoomMsgByRoomId(room_id).then(function(res) {
    console.log('==================================== Result getAllRoomMsgByRoomId');
    console.log(res);
    console.log('====================================');
});