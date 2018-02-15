var dataService = require('../lib/data_service');

dataService.getNextRoomId().then(function(room_id) {
    console.log('getNextRoomId: ' + room_id);
    var room = { "id": room_id, "name": "room_" + room_id };
    dataService.setRoom(room);

    dataService.getRoom(room_id).then(function(room) {
        console.log('====================================');
        console.log('room.id: ' + room.id);
        console.log('room.name: ' + room.name);
        console.log('====================================');
    });
});

// dataService.getAllRoom().then(function(rooms) {
//     console.log('====================================');
//     console.log('rooms: ' + rooms);
//     console.log('====================================');
//     console.log('Type rooms: ' + Object.prototype.toString.call(rooms));
//     rooms.forEach(function(room) {
//         console.log(room);
//     });
// });

// dataService.getTotalRoom().then(function(count) {
//     console.log('====================================');
//     console.log('count: ' + count);
//     console.log('====================================');
// });