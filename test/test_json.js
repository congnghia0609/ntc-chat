var room = { "id": 1, "name": "room 1" };
var room_str = JSON.stringify(room);
var room_json = JSON.parse(room_str);
console.log('====================================');
console.log('room_str: ' + room_str);
console.log('====================================');
console.log('room_json: ' + room_json);
console.log('room_json.name: ' + room_json.name);