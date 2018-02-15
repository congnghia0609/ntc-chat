var dataService = require('../lib/data_service');
//
var user_id = 1;
var ntf_id = 1;

// 1.1. Test getUserNtfRead
dataService.getUserNtfRead(user_id).then(function(ntf_id) {
    console.log('==================================== Test getUserNtfRead');
    console.log(ntf_id);
    console.log('====================================');
});

// 1.2. Test setUserNtfRead
dataService.setUserNtfRead(user_id, ntf_id).then(function(res) {
    console.log('==================================== Test setUserNtfRead');
    console.log(res);
    console.log('====================================');
});
dataService.getUserNtfRead(user_id).then(function(ntf_id) {
    console.log('==================================== Result setUserMsgRead');
    console.log(ntf_id);
    console.log('====================================');
});

// 1.3. Test setUserNtfReadAsync
var user_id = 65;
var ntf_id = 2;
dataService.setUserNtfReadAsync(user_id, ntf_id).then(function(res) {
    console.log('==================================== Test setUserNtfReadAsync');
    console.log(res);
    console.log('====================================');
});
dataService.getUserNtfRead(user_id).then(function(ntf_id) {
    console.log('==================================== Result setUserNtfReadAsync');
    console.log(ntf_id);
    console.log('====================================');
});