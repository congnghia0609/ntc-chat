var dataService = require('../lib/data_service');
//
// // 1.1. Test getAllUserNotifyByUserId
// var user_id = 1;
// dataService.getAllUserNotifyByUserId(user_id).then(function(res) {
//     console.log('==================================== Test getAllUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });

// // 1.2. Test addUserNotify
// var user_id = 1;
// var ntf_id = 2;
// dataService.addUserNotify(user_id, ntf_id).then(function(res) {
//     console.log('==================================== Test addUserNotify');
//     console.log(res);
//     console.log('====================================');
// });
// var ntf_id = 1;
// dataService.addUserNotify(user_id, ntf_id).then(function(res) {
//     console.log('==================================== Test addUserNotify');
//     console.log(res);
//     console.log('====================================');
// });

// // 1.3. Test getAllUserNotifyByUserId
// var user_id = 1;
// dataService.getAllUserNotifyByUserId(user_id).then(function(res) {
//     console.log('==================================== Test getAllUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });

// // 1.4. Test totalUserNotifyByUserId
// var user_id = 1;
// dataService.totalUserNotifyByUserId(user_id).then(function(res) {
//     console.log('==================================== Test totalUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });

// // 1.5. Test removeUserNotifyByUserId
// dataService.removeUserNotifyByUserId(user_id, ntf_id).then(function(res) {
//     console.log('==================================== Test removeUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });
// dataService.getAllUserNotifyByUserId(user_id).then(function(res) {
//     console.log('==================================== Result removeUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });

// // 1.6. Test existUserNotifyByUserId
// dataService.existUserNotifyByUserId(user_id, ntf_id).then(function(res) {
//     console.log('==================================== Test existUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });
// var ntf_id = 2;
// dataService.existUserNotifyByUserId(user_id, ntf_id).then(function(res) {
//     console.log('==================================== Test existUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });

// // 1.7. Test getSlideUserNotifyByUserId
// var page = 1;
// dataService.getSlideUserNotifyByUserId(user_id, page).then(function(res) {
//     console.log('==================================== Test getSlideUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });
// dataService.getAllUserNotifyByUserId(user_id).then(function(res) {
//     console.log('==================================== Result getSlideUserNotifyByUserId');
//     console.log(res);
//     console.log('====================================');
// });

// 1.8. Test getAllUserNotifyByUserId
var user_id = 65;
dataService.getAllUserNotifyByUserId(user_id).then(function(res) {
    console.log('==================================== Result getSlideUserNotifyByUserId=' + user_id);
    console.log(res);
    console.log('====================================');
});

// 1.9. Test getUnreadUserNotifyByUserId
var user_id = 65;
dataService.getUnreadUserNotifyByUserId(user_id).then(function(res) {
    console.log('==================================== Result getUnreadUserNotifyByUserId=' + user_id);
    console.log(res);
    console.log('====================================');
});