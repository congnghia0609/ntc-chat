var dataService = require('../lib/data_service');
//

// 1.1. Test getUserLastMsg
var user_id = 1;
var room_id = 3;
dataService.getUserLastMsg(user_id, room_id).then(function(res) {
    console.log('==================================== Test getUserLastMsg');
    console.log(res);
    console.log('====================================');
});

// 1.2. Test setUserLastMsg
var msg = {
    type_sk: 'SK_Message',
    type_msg: 'MSG_Chat',
    from_user_id: 10,
    to_user_id: 8,
    room_id: 9,
    content: 'wwwwwwwww',
    created: 1501746695024,
    updated: 1501746695025,
    from_user: {
        id: 2,
        email: 'nghia2@gmail.com',
        name: 'nghia tran',
        type_user: 'candidate',
        avt: ''
    },
    to_user: {
        id: 3,
        email: 'user3@gmail.com',
        name: 'user 3',
        type_user: 'candidate',
        avt: ''
    },
    status: 'send',
    id: 2
};
var from_user_id = 10;
var to_user_id = 8;
var room_id = 9;
dataService.setUserLastMsg(msg).then(function(res) {
    console.log('==================================== Test setUserLastMsg');
    console.log(res);
    console.log('====================================');
});
dataService.getUserLastMsg(from_user_id, room_id).then(function(res) {
    console.log('==================================== Result getUserLastMsg from_user_id');
    console.log(res);
    console.log('====================================');
});
dataService.getUserLastMsg(to_user_id, room_id).then(function(res) {
    console.log('==================================== Result getUserLastMsg to_user_id');
    console.log(res);
    console.log('====================================');
});

// 1.3. Test setUserLastMsgAsync
var msg = {
    type_sk: 'SK_Message',
    type_msg: 'MSG_Chat',
    from_user_id: 10,
    to_user_id: 12,
    room_id: 13,
    content: 'wwwwwwwww',
    created: 1501746695024,
    updated: 1501746695025,
    from_user: {
        id: 2,
        email: 'nghia2@gmail.com',
        name: 'nghia tran',
        type_user: 'candidate',
        avt: ''
    },
    to_user: {
        id: 3,
        email: 'user3@gmail.com',
        name: 'user 3',
        type_user: 'candidate',
        avt: ''
    },
    status: 'send',
    id: 4
};
var from_user_id = 10;
var to_user_id = 12;
var room_id = 13;
dataService.setUserLastMsgAsync(msg).then(function(res) {
    console.log('==================================== Test setUserLastMsgAsync');
    console.log(res);
    console.log('====================================');
});
dataService.getUserLastMsg(from_user_id, room_id).then(function(res) {
    console.log('==================================== Result setUserLastMsgAsync from_user_id');
    console.log(res);
    console.log('====================================');
});
dataService.getUserLastMsg(to_user_id, room_id).then(function(res) {
    console.log('==================================== Result setUserLastMsgAsync to_user_id');
    console.log(res);
    console.log('====================================');
});

// 1.4. Test getAllUserLastMsgByUserId
dataService.getAllUserLastMsgByUserId(from_user_id).then(function(res) {
    console.log('==================================== Test getAllUserLastMsgByUserId');
    console.log(res);
    console.log('====================================');
});

// 1.5. Test getSlideUserLastMsgByUserId
var page = 1;
dataService.getSlideUserLastMsgByUserId(from_user_id, page).then(function(res) {
    console.log('==================================== Test getSlideUserLastMsgByUserId');
    console.log(res);
    var rs = JSON.stringify(res);
    console.log(rs);
    console.log('====================================');
});