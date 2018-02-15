var dataService = require('../lib/data_service');
//

var user_id = 1;
// 1.1. Test getUserDeviceByUserId.
dataService.getUserDeviceByUserId(user_id).then(function(res) {
    console.log('==================================== Test getUserDeviceByUserId');
    console.log(res);
    console.log('====================================');
});

// 1.2. Test setUserDevice.
var data = {
    user_id: user_id,
    fcm_token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    devide_id: "123456789", // imei or uuid.
    os: "browser",
    model: "chrome v.55",
    app_type: "ntc",
};
dataService.setUserDevice(data).then(function(res) {
    console.log('==================================== Test setUserDevice');
    console.log(res);
    console.log('====================================');
});
dataService.getUserDeviceByUserId(user_id).then(function(res) {
    console.log('==================================== Result getUserDeviceByUserId');
    console.log(res);
    console.log('====================================');
});

// 1.3. Test setUserDeviceAsync.
var user_id = 2;
var data = {
    user_id: user_id,
    fcm_token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    devide_id: "123456789", // imei or uuid.
    os: "browser",
    model: "chrome v.55",
    app_type: "ntc",
};
dataService.setUserDeviceAsync(data).then(function(res) {
    console.log('==================================== Test setUserDeviceAsync');
    console.log(res);
    console.log('====================================');
});
dataService.getUserDeviceByUserId(user_id).then(function(res) {
    console.log('==================================== Result getUserDeviceByUserId');
    console.log(res);
    console.log('====================================');
});

// 1.3. Test deleteUserDevice.
dataService.deleteUserDevice(user_id, data.fcm_token).then(function(res) {
    console.log('==================================== Test deleteUserDevice');
    console.log(res);
    console.log('====================================');
});
dataService.getUserDeviceByUserId(user_id).then(function(res) {
    console.log('==================================== Result getUserDeviceByUserId');
    console.log(res);
    console.log('====================================');
});