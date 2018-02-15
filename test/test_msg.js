var dataService = require('../lib/data_service');
//
var from_user = 1;
var to_user = 2;
var room_id = 3;
var content = "this is content msg.";
var type = "chat";
var create = new Date().getTime();
var update = new Date().getTime();
var status = "active";

var msg = {};
msg.from_user = from_user;
msg.to_user = to_user;
msg.room_id = room_id;
msg.content = content;
msg.type = type;
msg.create = create;
msg.update = update;
msg.status = status;
console.log('begin msg: ');
console.log(msg);

// // 1.1. // Test getMsg.
// var msg_id = 19;
// dataService.getMsg(msg_id).then(function(msg) {
//     console.log('==================================== Test getMsg');
//     console.log(msg);
//     console.log('====================================');
// });

// 4 --> 9
// 1.2. Test setMsg
// dataService.setMsg(msg).then(function(msg) {
//     console.log('==================================== Test setMsg');
//     console.log(msg);
//     console.log('====================================');
// });

// // 1.3. Test setMsg2
// dataService.getNextMsgId().then(function(id) {
//     if (id) {
//         msg.id = id;
//         dataService.setMsg(msg).then(function(msg) {
//             console.log('==================================== Test setMsg2');
//             console.log(msg);
//             console.log('====================================');
//         });
//     }
// });

// 1.4. Test makeListIds
// var ids = [4, 5, 6, 7, 8, 9];
// dataService.makeListIds(dataService.MSG_KEY, ids).then(function(keys) {
//     console.log('==================================== Test makeListIds');
//     console.log(keys);
//     console.log('====================================');
// });

// 1.5. Test getListMsgs
var ids = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
dataService.getListMsgs(ids).then(function(msgs) {
    console.log('==================================== Test getListMsgs');
    console.log(msgs);
    console.log('====================================');
});

// 1.6. Test setMsgAsync
// dataService.setMsgAsync(msg).then(function(res) {
//     console.log('==================================== Test setMsgAsync');
//     console.log(res);
//     console.log('====================================');
//     dataService.getMsg(res.id).then(function(msg1) {
//         console.log('==================================== Test getMsg');
//         console.log(msg1);
//         console.log('====================================');
//     });
// });