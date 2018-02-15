var dataService = require('../lib/data_service');
var fcmUtil = require('../lib/fcm_util');

var to_user_id = 95;
var data = {
    from_user_id: 1,
    to_user_id: to_user_id,
    notification: {
        title: "New Test Notification!",
        body: "There is a new notification in ntc-notify",
        icon: "/images/profile_placeholder.png",
        click_action: "http://localhost:5000"
    },
};

// Get map token of User.
dataService.getUserDeviceByUserId(to_user_id).then(function(res) {
    if (res) {
        console.log('==================================== Test getUserDeviceByUserId');
        console.log(res);
        console.log('====================================');
        // Notify via Firebase. OUT_APP.
        for (var token in res) {
            var ntf = {};
            ntf.fcm_token = token;
            ntf.notification = data.notification;
            // Send notify User-Device to Firebase.
            fcmUtil.sendNotify(ntf).then(function(fcm_res) {});
        }
    }
});