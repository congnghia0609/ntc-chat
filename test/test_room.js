var dataService = require('../lib/data_service');

// 1.1. Test createRoom
dataService.createRoom().then(function(room) {
    console.log('==================================== Test createRoom');
    console.log(room);
    console.log('====================================');
});

// 1.2. Test getAllRoom
dataService.getAllRoom().then(function(rooms) {
    console.log('==================================== Test getAllRoom');
    console.log(rooms);
    console.log('====================================');
});