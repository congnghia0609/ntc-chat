var dataService = require('../lib/data_service');
//
var user_id = 1;
var room_id = 1;
var msg_id = 1;
var msg = {
    user_id: user_id,
    room_id: room_id,
    msg_id: msg_id
};

// 1.1. Test getUserRoomMsgRead
dataService.getAllUserRoomMsgReadByUserId(user_id).then(function(res) {
    console.log('==================================== Test getAllUserRoomMsgReadByUserId');
    console.log(res);
    console.log('====================================');
});

// 1.2. Test setUserRoomMsgRead
dataService.setUserRoomMsgRead(msg).then(function(res) {
    console.log('==================================== Test setUserRoomMsgRead');
    console.log(res);
    console.log('====================================');
});
dataService.getAllUserRoomMsgReadByUserId(user_id).then(function(res) {
    console.log('==================================== Result setUserRoomMsgRead');
    console.log(res);
    console.log('====================================');
});

// 1.3. Test setUserRoomMsgReadAsync
var user_id = 1;
var msg_id = 2;
var msg = {
    user_id: user_id,
    room_id: room_id,
    msg_id: msg_id
};
dataService.setUserRoomMsgReadAsync(msg).then(function(res) {
    console.log('==================================== Test setUserRoomMsgReadAsync');
    console.log(res);
    console.log('====================================');
});
dataService.getAllUserRoomMsgReadByUserId(user_id).then(function(res) {
    console.log('==================================== Result setUserRoomMsgReadAsync');
    console.log(res);
    console.log('====================================');
});

// 1.4. Test getUnreadUserRoomMsgReadByUserId
dataService.getUnreadUserRoomMsgReadByUserId(user_id).then(function(res) {
    console.log('==================================== Test getUnreadUserRoomMsgReadByUserId');
    console.log(res);
    console.log('====================================');
});