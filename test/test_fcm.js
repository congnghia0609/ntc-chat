var Config = require('../config/config'),
    conf = new Config();
var FCM = require('fcm-node');
// var serverKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var serverKey = conf.firebase_server_key;
var fcm = new FCM(serverKey);

// This may vary according to the message type (single recipient, multicast, topic, et cetera) 
var message = {
    to: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    // collapse_key: 'Updates Available',
    priority: "high",
    time_to_live: 2419200, // default 28 days == 2,419,200 seconds.
    notification: {
        title: "New chat message!",
        body: "There is a new message in ntc-chat",
        icon: "/images/profile_placeholder.png",
        click_action: "http://localhost:5000"
    },
    //you can send only notification or only data(or include both) 
    // data: {
    //     my_key: 'my value',
    //     my_another_key: 'my another value'
    // }
};

fcm.send(message, function(err, response) {
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});