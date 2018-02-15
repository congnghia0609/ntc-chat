var dataService = require('../lib/data_service');
//
var msg_id = 1;
var from_user_id = 1;
var to_user_id = 2;
var timestamp = new Date().getTime();
var status = "active";

var msg = {
    id: msg_id,
    from_user_id: from_user_id,
    to_user_id: to_user_id,
    notification: {
        title: "New chat message!",
        body: "There is a new message in ntc-chat",
        icon: "/images/profile_placeholder.png",
        click_action: "http://localhost:5000"
    },
    create: timestamp,
    update: timestamp,
    status: status,
};
console.log('begin msg: ');
console.log(msg);

// // 1.1. Test getMsg.
// dataService.getNotify(msg_id).then(function(msg) {
//     console.log('==================================== Test getNotify');
//     console.log(msg);
//     console.log('====================================');
// });

// // 1.2. Test setNotify
// dataService.setNotify(msg).then(function(msg) {
//     console.log('==================================== Test setNotify');
//     console.log(msg);
//     console.log('====================================');
// });
// dataService.getNotify(msg_id).then(function(msg) {
//     console.log('==================================== Result setNotify');
//     console.log(msg);
//     console.log('====================================');
// });

// // 1.3. Test setNotifyAsync
// dataService.setNotifyAsync(msg).then(function(msg) {
//     console.log('==================================== Test setNotifyAsync');
//     console.log(msg);
//     console.log('====================================');
// });
// dataService.getNotify(msg_id).then(function(msg) {
//     console.log('==================================== Result setNotifyAsync');
//     console.log(msg);
//     console.log('====================================');
// });

// // 1.4. Test getNextNotifyId
// dataService.getNextNotifyId().then(function(id) {
//     if (id) {
//         msg.id = id;
//         dataService.setNotify(msg).then(function(msg) {
//             console.log('==================================== Test getNextNotifyId');
//             console.log(msg);
//             console.log('====================================');
//         });
//     }
// });

// // 1.5. Test makeListIds
// var ids = [4, 5, 6, 7, 8, 9];
// dataService.makeListIds(dataService.NOTIFY_KEY, ids).then(function(keys) {
//     console.log('==================================== Test makeListIds');
//     console.log(keys);
//     console.log('====================================');
// });

// // 1.6. Test getListNotify
// var ids = [1, 2];
// dataService.getListNotify(ids).then(function(msgs) {
//     console.log('==================================== Test getListNotify');
//     console.log(msgs);
//     console.log('====================================');
// });

// 1.7. Test getAllListNotify
// dataService.getAllListNotify().then(function(res) {
//     console.log('==================================== Test getAllListNotify');
//     console.log(res);
//     console.log('====================================');
// });