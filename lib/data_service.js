// @ts-nocheck
var Config = require('../config/config'),
    conf = new Config();
var Q = require('q');
var redis = require("redis");
var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var paging = conf.paging;
var redis_url = conf.redis_url;
var client = redis.createClient(redis_url);

// Instance
var _this = this;
// Constants
function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}
// Constants Key.
define("ID_KEY", "id:");
define("ROOM_KEY", "room:");
define("MSG_KEY", "msg:");
define("USER_KEY", "user:");
define("USER_LAST_MSG_KEY", "user_last_msg:");
define("USER_ROOM_KEY", "user_room:");
define("ROOM_USER_KEY", "room_user:");
define("ROOM_MSG_KEY", "room_msg:");
define("USER_USER_ROOM_KEY", "user_user_room:");
define("USER_ROOM_MSG_READ_KEY", "user_room_msg_read:");
// Constant Room Type.
define("ROOM_TYPE_ONE", "one");
define("ROOM_TYPE_MANY", "many");
// Constant Notification.
define("NOTIFY_KEY", "notify:");
define("USER_DEVICE_KEY", "user_device:");
define("USER_NOTIFY_KEY", "user_notify:");
define("USER_NOTIFY_READ_KEY", "user_notify_read:");

client.on("error", function(err) {
    console.error("Error " + err);
});

// ============= CLOSE ============= //
module.exports.close = function() {
    console.log('Closing redis connection...');
    client.quit();
};

// ============= COMMON ============= //
module.exports.makeId = function(KEY, id) {
    var deferred = Q.defer();
    var key = KEY + id;
    deferred.resolve(key);
    return deferred.promise;
};

module.exports.makeListIds = function(KEY, ids) {
    var listIds = [];
    var deferred = Q.defer();
    if (ids) {
        ids.forEach(function(id) {
            var key = KEY + id;
            listIds.push(key);
        });
        deferred.resolve(listIds);
    }
    return deferred.promise;
};

// ============= ROOM ============= //
module.exports.getNextRoomId = function() {
    var deferred = Q.defer();
    client.incr(_this.ID_KEY + 'room_id', function(err, id) {
        deferred.resolve(id);
    });
    return deferred.promise;
};

module.exports.createRoom = function() {
    var deferred = Q.defer();
    var room = {};
    _this.getNextRoomId().then(function(id) {
        room.id = id;
        room.name = "room_" + id;
        room.type = _this.ROOM_TYPE_ONE;
        var room_str = JSON.stringify(room);
        client.setAsync(_this.ROOM_KEY + room.id, room_str).then(function(res) {
            console.log(res);
        });
        deferred.resolve(room);
    });
    return deferred.promise;
};

module.exports.setRoom = function(room) {
    var deferred = Q.defer();
    if (room.id && room.id >= 0) {
        var room_str = JSON.stringify(room);
        client.set(_this.ROOM_KEY + room.id, room_str);
        deferred.resolve(room);
    } else {
        deferred.resolve(null);
        console.log("room.id invalid.");
        deferred.reject("room.id invalid.");
    }
    return deferred.promise;
};

module.exports.setRoomAsync = function(room) {
    var deferred = Q.defer();
    if (room.id && room.id >= 0) {
        var room_str = JSON.stringify(room);
        client.setAsync(_this.ROOM_KEY + room.id, room_str).then(function(res) {
            console.log(res);
        });
        deferred.resolve(room);
    } else {
        deferred.resolve(null);
        console.log("room.id invalid.");
        deferred.reject("room.id invalid.");
    }
    return deferred.promise;
};

module.exports.getRoom = function(room_id) {
    var deferred = Q.defer();
    client.get(_this.ROOM_KEY + room_id, function(err, room_str) {
        msg = JSON.parse(room_str);
        deferred.resolve(msg);
    });
    return deferred.promise;
};

module.exports.getAllRoom = function() {
    var deferred = Q.defer();
    client.keys(_this.ROOM_KEY + "*", function(err, keys) {
        if (err) console.log(err);
        client.mget(keys, function(err, values) {
            if (err) { console.log(err) }
            // console.log(values);
            var rooms = [];
            values.forEach(function(value) {
                var room = JSON.parse(value);
                rooms.push(room);
            });
            deferred.resolve(rooms);
            // console.log(rooms);
        });
    });
    return deferred.promise;
};

module.exports.getTotalRoom = function() {
    var deferred = Q.defer();
    client.keys(_this.ROOM_KEY + "*", function(err, keys) {
        if (err) console.log(err);
        deferred.resolve(keys.length);
    });
    return deferred.promise;
};

// ============= MSG ============= //
module.exports.getNextMsgId = function() {
    var deferred = Q.defer();
    client.incr(_this.ID_KEY + 'msg_id', function(err, id) {
        deferred.resolve(id);
    });
    return deferred.promise;
};

module.exports.setMsg = function(msg) {
    var deferred = Q.defer();
    if (msg.id && msg.id >= 0) {
        var msg_str = JSON.stringify(msg);
        client.set(_this.MSG_KEY + msg.id, msg_str);
        deferred.resolve(msg);
    } else {
        _this.getNextMsgId().then(function(id) {
            msg.id = id;
            var msg_str = JSON.stringify(msg);
            client.set(_this.MSG_KEY + msg.id, msg_str);
            deferred.resolve(msg);
        });
    }
    return deferred.promise;
};

module.exports.setMsgAsync = function(msg) {
    var deferred = Q.defer();
    if (msg.id && msg.id >= 0) {
        var msg_str = JSON.stringify(msg);
        client.setAsync(_this.MSG_KEY + msg.id, msg_str).then(function(res) {
            console.log(res);
        });
        deferred.resolve(msg);
    } else {
        _this.getNextMsgId().then(function(id) {
            msg.id = id;
            var msg_str = JSON.stringify(msg);
            client.setAsync(_this.MSG_KEY + msg.id, msg_str).then(function(res) {
                console.log(res);
            });
            deferred.resolve(msg);
        });
    }
    return deferred.promise;
};

module.exports.getMsg = function(msg_id) {
    var deferred = Q.defer();
    client.get(_this.MSG_KEY + msg_id, function(err, msg_str) {
        msg = JSON.parse(msg_str);
        deferred.resolve(msg);
    });
    return deferred.promise;
};

module.exports.getListMsgs = function(ids) {
    var deferred = Q.defer();
    if (ids) {
        _this.makeListIds(_this.MSG_KEY, ids).then(function(keys) {
            client.mget(keys, function(err, msgs) {
                if (err) { console.log(err) }
                var listMsg = [];
                msgs.forEach(function(msg_str) {
                    msg = JSON.parse(msg_str);
                    listMsg.push(msg);
                });
                deferred.resolve(listMsg);
            });
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

// ============= USER ============= //
module.exports.getNextUserId = function() {
    var deferred = Q.defer();
    client.incr(_this.ID_KEY + 'user_id', function(err, id) {
        deferred.resolve(id);
    });
    return deferred.promise;
};

module.exports.setUser = function(user) {
    var deferred = Q.defer();
    var user_str = JSON.stringify(user);
    client.set(_this.USER_KEY + user.id, user_str);
    deferred.resolve(user);
    return deferred.promise;
};

module.exports.setUserAsync = function(user) {
    var deferred = Q.defer();
    var user_str = JSON.stringify(user);
    client.setAsync(_this.USER_KEY + user.id, user_str).then(function(res) {});
    deferred.resolve(user);
    return deferred.promise;
};

module.exports.getUser = function(user_id) {
    var deferred = Q.defer();
    client.get(_this.USER_KEY + user_id, function(err, user_str) {
        user = JSON.parse(user_str);
        deferred.resolve(user);
    });
    return deferred.promise;
};

// ============= USER_LAST_MSG ============= //
module.exports.setUserLastMsg = function(msg) {
    var deferred = Q.defer();
    var from_user_id = msg.from_user_id;
    var to_user_id = msg.to_user_id;
    var room_id = msg.room_id;
    if (room_id && room_id > 0 && from_user_id && from_user_id > 0 && to_user_id && to_user_id > 0) {
        var msg_str = JSON.stringify(msg);
        // client.hmset(_this.USER_LAST_MSG_KEY + from_user_id, room_id, msg_str);
        // client.hmset(_this.USER_LAST_MSG_KEY + to_user_id, room_id, msg_str);
        // deferred.resolve(msg);
        client.multi().hmset(_this.USER_LAST_MSG_KEY + from_user_id, room_id, msg_str)
            .hmset(_this.USER_LAST_MSG_KEY + to_user_id, room_id, msg_str).exec(function(err, res) {
                deferred.resolve(res);
            });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.setUserLastMsgAsync = function(msg) {
    var deferred = Q.defer();
    var from_user_id = msg.from_user_id;
    var to_user_id = msg.to_user_id;
    var room_id = msg.room_id;
    if (room_id && room_id > 0 && from_user_id && from_user_id > 0 && to_user_id && to_user_id > 0) {
        var msg_str = JSON.stringify(msg);
        client.multi().hmset(_this.USER_LAST_MSG_KEY + from_user_id, room_id, msg_str)
            .hmset(_this.USER_LAST_MSG_KEY + to_user_id, room_id, msg_str).execAsync().then(function(res) {
                deferred.resolve(res);
            });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getUserLastMsg = function(user_id, room_id) {
    var deferred = Q.defer();
    if (user_id && room_id && user_id > 0 && room_id > 0) {
        client.hgetall(_this.USER_LAST_MSG_KEY + user_id, function(err, res) {
            if (res) {
                var msg_str = res[room_id];
                if (msg_str) {
                    var msg = JSON.parse(msg_str);
                    deferred.resolve(msg);
                } else {
                    deferred.resolve(null);
                }
            } else {
                deferred.resolve(null);
            }
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getAllUserLastMsgByUserId = function(user_id) {
    var deferred = Q.defer();
    if (user_id && user_id > 0) {
        client.hgetall(_this.USER_LAST_MSG_KEY + user_id, function(err, res) {
            if (res) {
                var mapRM = {};
                for (var key in res) {
                    var msg_str = res[key];
                    var room_id = parseInt(key);
                    var msg = JSON.parse(msg_str);
                    mapRM[room_id] = msg;
                }
                deferred.resolve(mapRM);
            } else {
                deferred.resolve(null);
            }
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getSlideUserLastMsgByUserId = function(user_id, page) {
    var deferred = Q.defer();
    if (user_id && user_id > 0) {
        client.hgetall(_this.USER_LAST_MSG_KEY + user_id, function(err, res) {
            if (res) {
                var rs = {};
                var listMsg = [];
                var arrRoomId = [];
                var mapRM = {};
                for (var key in res) {
                    var msg_str = res[key];
                    var room_id = parseInt(key);
                    var msg = JSON.parse(msg_str);
                    mapRM[room_id] = msg;
                    arrRoomId.push(room_id);
                }
                var total = arrRoomId.length;
                var totalPage = Math.ceil(total / paging);
                if (total > 0) {
                    if (page == null || page == undefined) {
                        page = 1;
                    }
                    // 1 <= page <= totalPage
                    page = Math.min(Math.max(1, page), totalPage);
                    // 0 <= min_index <= max_index <= totalPage
                    var min_index = Math.max(0, (page - 1) * paging);
                    var max_index = Math.min(min_index + paging, total);
                    arrRoomId = arrRoomId.sort(function(a, b) { return b - a });
                    var pageRoomId = arrRoomId.slice(min_index, max_index);
                    for (var k in pageRoomId) {
                        var rid = pageRoomId[k];
                        listMsg.push(mapRM[rid]);
                    }
                }
                // Result.
                rs.user_id = user_id;
                rs.total_page = totalPage;
                rs.page = page;
                rs.list_msg = listMsg;
                deferred.resolve(rs);
            } else {
                deferred.resolve(null);
            }
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.searchUserLastMsgByNameUser = function(user_id, name) {
    var deferred = Q.defer();
    if (user_id && user_id > 0 && name && name.length > 0) {
        client.hgetall(_this.USER_LAST_MSG_KEY + user_id, function(err, res) {
            if (res) {
                name = name.toLowerCase();
                var listMsg = [];
                for (var key in res) {
                    var msg_str = res[key];
                    var msg = JSON.parse(msg_str);
                    var from_user_id = msg.from_user_id;
                    if (user_id == from_user_id) {
                        var nameUser = msg.to_user.name;
                        nameUser = nameUser.toLowerCase();
                        if (nameUser.indexOf(name) >= 0) {
                            listMsg.push(msg);
                        }
                    } else {
                        var nameUser = msg.from_user.name;
                        nameUser = nameUser.toLowerCase();
                        if (nameUser.indexOf(name) >= 0) {
                            listMsg.push(msg);
                        }
                    }
                }
                deferred.resolve(listMsg);
            } else {
                deferred.resolve(null);
            }
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

// ============= USER_ROOM ============= //
// Map Room of User.

// ============= ROOM_USER ============= //
// Set User of Room.
module.exports.addRoomUser = function(room_id, user_id) {
    var deferred = Q.defer();
    if (room_id && user_id && room_id >= 0 && user_id >= 0) {
        client.sadd(_this.ROOM_USER_KEY + room_id, user_id);
    }
    deferred.resolve(user_id);
    return deferred.promise;
};

module.exports.addRoomUser2User = function(room_id, user_id1, user_id2) {
    var deferred = Q.defer();
    if (room_id && user_id1 && user_id2 && room_id >= 0 && user_id1 >= 0 && user_id2 >= 0) {
        client.multi().sadd(_this.ROOM_USER_KEY + room_id, user_id1)
            .sadd(_this.ROOM_USER_KEY + room_id, user_id2).exec(function(err, res) {
                deferred.resolve(res);
            });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.addRoomUser2UserAsync = function(room_id, user_id1, user_id2) {
    var deferred = Q.defer();
    if (room_id && user_id1 && user_id2 && room_id >= 0 && user_id1 >= 0 && user_id2 >= 0) {
        client.multi().sadd(_this.ROOM_USER_KEY + room_id, user_id1)
            .sadd(_this.ROOM_USER_KEY + room_id, user_id2).execAsync().then(function(res) {
                deferred.resolve(res);
            });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getAllRoomUserByRoomId = function(room_id) {
    var deferred = Q.defer();
    client.smembers(_this.ROOM_USER_KEY + room_id, function(err, res) {
        var userIds = [];
        res.forEach(function(id) {
            var userId = parseInt(id);
            userIds.push(userId);
        });
        deferred.resolve(userIds);
    });
    return deferred.promise;
};

module.exports.removeRoomUser = function(room_id) {
    var deferred = Q.defer();
    client.del(_this.ROOM_USER_KEY + room_id, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

// ============= ROOM_MSG ============= //
// Set message id of room.
module.exports.addRoomMsg = function(room_id, msg_id) {
    var deferred = Q.defer();
    if (room_id && msg_id && room_id >= 0 && msg_id >= 0) {
        client.sadd(_this.ROOM_MSG_KEY + room_id, msg_id);
    }
    deferred.resolve(msg_id);
    return deferred.promise;
};

module.exports.getAllRoomMsgByRoomId = function(room_id) {
    var deferred = Q.defer();
    client.smembers(_this.ROOM_MSG_KEY + room_id, function(err, res) {
        var msgIds = [];
        res.forEach(function(id) {
            var msgId = parseInt(id);
            msgIds.push(msgId);
        });
        deferred.resolve(msgIds);
    });
    return deferred.promise;
};

module.exports.totalRoomMsgByRoomId = function(room_id) {
    var deferred = Q.defer();
    client.scard(_this.ROOM_MSG_KEY + room_id, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

module.exports.existRoomMsgByRoomId = function(room_id, msg_id) {
    // return 1 is exist, 0 is not exist.
    var deferred = Q.defer();
    client.sismember(_this.ROOM_MSG_KEY + room_id, msg_id, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

module.exports.removeRoomMsgByRoomId = function(room_id, msg_id) {
    // return 1 is success, 0 is fail or not found.
    var deferred = Q.defer();
    client.srem(_this.ROOM_MSG_KEY + room_id, msg_id, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

module.exports.slideRoomMsgByRoomId = function(room_id, start, end) {
    // return 1 is success, 0 is fail or not found.
    var deferred = Q.defer();
    client.smembers(_this.ROOM_MSG_KEY + room_id, function(err, res) {
        var msgIds = [];
        res.forEach(function(id) {
            var msgId = parseInt(id);
            msgIds.push(msgId);
        });
        msgIds.reverse();
        msgIds = msgIds.slice(start, end);
        deferred.resolve(msgIds);
    });
    return deferred.promise;
};

module.exports.getSlideRoomMsgByRoomId = function(room_id, page) {
    // return 1 is success, 0 is fail or not found.
    var deferred = Q.defer();
    client.smembers(_this.ROOM_MSG_KEY + room_id, function(err, res) {
        var rs = {};
        var listMsgIds = [];
        var msgIds = [];
        var total = res.length;
        var totalPage = Math.ceil(total / paging);
        if (total > 0) {
            if (page == null || page == undefined) {
                page = 1;
            }
            // msgIds.reverse();
            // 1 <= page <= totalPage
            page = Math.min(Math.max(1, page), totalPage);
            // 0 <= min_index <= max_index <= totalPage
            // // Lay xuoi danh sach giam dan.
            // var min_index = Math.max(0, (page - 1) * paging);
            // var max_index = Math.min(min_index + paging, total);
            // Lay nguoc danh sach tang dan.
            var max_index = Math.min(total - ((page - 1) * paging), total);
            var min_index = Math.max(0, max_index - paging);
            msgIds = res.slice(min_index, max_index);
            if (msgIds && msgIds.length > 0) {
                for (var i = msgIds.length - 1; i >= 0; --i) {
                    var msgId = parseInt(msgIds[i]);
                    listMsgIds.push(msgId);
                }
            }
        }
        rs.room_id = room_id;
        rs.total_page = totalPage;
        rs.page = page;
        rs.msg_ids = listMsgIds;
        deferred.resolve(rs);
    });
    return deferred.promise;
};

// ============= USER_USER_ROOM ============= //
module.exports.setUserUserRoom = function(user_id1, user_id2, room_id) {
    var deferred = Q.defer();
    var key1 = user_id1 + "_" + user_id2;
    var key2 = user_id2 + "_" + user_id1;
    client.multi().set(_this.USER_USER_ROOM_KEY + key1, room_id)
        .set(_this.USER_USER_ROOM_KEY + key2, room_id).exec(function(err, res) {
            deferred.resolve(res);
        });
    return deferred.promise;
};

module.exports.setUserUserRoomAsync = function(user_id1, user_id2, room_id) {
    var deferred = Q.defer();
    var key1 = user_id1 + "_" + user_id2;
    var key2 = user_id2 + "_" + user_id1;
    client.multi().set(_this.USER_USER_ROOM_KEY + key1, room_id)
        .set(_this.USER_USER_ROOM_KEY + key2, room_id).execAsync().then(function(res) {
            deferred.resolve(res);
        });
    return deferred.promise;
};

module.exports.getUserUserRoom = function(user_id1, user_id2) {
    var deferred = Q.defer();
    var key1 = user_id1 + "_" + user_id2;
    client.get(_this.USER_USER_ROOM_KEY + key1, function(err, room_id) {
        deferred.resolve(room_id);
    });
    return deferred.promise;
};

module.exports.removeUserUserRoom = function(user_id1, user_id2) {
    var deferred = Q.defer();
    var key1 = user_id1 + "_" + user_id2;
    var key2 = user_id2 + "_" + user_id1;
    client.del(_this.USER_USER_ROOM_KEY + key1, _this.USER_USER_ROOM_KEY + key2, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

// ============= USER_ROOM_MSG_READ ============= //
// Map[UserId-Map[RoomId-MsgId]]
module.exports.setUserRoomMsgRead = function(msg) {
    var deferred = Q.defer();
    var user_id = msg.user_id;
    var room_id = msg.room_id;
    var msg_id = msg.msg_id;
    if (room_id && room_id > 0 && user_id && user_id > 0 && msg_id && msg_id > 0) {
        client.hmset(_this.USER_ROOM_MSG_READ_KEY + user_id, room_id, msg_id);
        deferred.resolve(msg);
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.setUserRoomMsgReadAsync = function(msg) {
    var deferred = Q.defer();
    var user_id = msg.user_id;
    var msg_id = msg.msg_id;
    var room_id = msg.room_id;
    if (room_id && room_id > 0 && user_id && user_id > 0 && msg_id && msg_id > 0) {
        // client.multi().hmset(_this.USER_ROOM_MSG_READ_KEY + user_id, room_id, msg_id).execAsync().then(function(res) {
        //     deferred.resolve(res);
        // });
        client.hmsetAsync(_this.USER_ROOM_MSG_READ_KEY + user_id, room_id, msg_id).then(function(res) {
            deferred.resolve(res);
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getUserRoomMsgRead = function(user_id, room_id) {
    var deferred = Q.defer();
    if (user_id && room_id && user_id > 0 && room_id > 0) {
        client.hgetall(_this.USER_ROOM_MSG_READ_KEY + user_id, function(err, res) {
            if (res) {
                var msg_id = res[room_id];
                deferred.resolve(msg_id);
            } else {
                deferred.resolve(null);
            }
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getAllUserRoomMsgReadByUserId = function(user_id) {
    var deferred = Q.defer();
    if (user_id && user_id > 0) {
        client.hgetall(_this.USER_ROOM_MSG_READ_KEY + user_id, function(err, res) {
            if (res) {
                var mapRM = {};
                for (var key in res) {
                    var room_id = parseInt(key);
                    var msg_id = parseInt(res[key]);
                    mapRM[room_id] = msg_id;
                }
                deferred.resolve(mapRM);
            } else {
                deferred.resolve(null);
            }
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getUnreadUserRoomMsgReadByUserId = async function(user_id) {
    var deferred = Q.defer();
    if (user_id && user_id > 0) {
        await client.hgetall(_this.USER_ROOM_MSG_READ_KEY + user_id, async function(err, res) {
            if (res) {
                var rs = {};
                var total_unread = 0;
                var map_room_msg_unread = {};
                for (var key in res) {
                    var room_msg_unread = {};
                    var room_id = parseInt(key);
                    var msg_id = parseInt(res[key]);
                    room_msg_unread.room_id = room_id;
                    room_msg_unread.msgid_last_read = msg_id;
                    // Read list msgids of room.
                    await _this.getAllRoomMsgByRoomId(room_id).then(async function(res) {
                        var total_room_unread = 0;
                        if (res) {
                            var n = res.length;
                            for (var i = n - 1; i >= 0; --i) {
                                var msgId = parseInt(res[i]);
                                if (msgId > msg_id) {
                                    ++total_room_unread;
                                } else {
                                    break;
                                }
                            }
                        }
                        total_unread += total_room_unread;
                        room_msg_unread.total_room_unread = total_room_unread;
                    });
                    map_room_msg_unread[room_id] = room_msg_unread;
                }
                rs.total_unread = total_unread;
                rs.map_room_msg_unread = map_room_msg_unread;
                deferred.resolve(rs);
            } else {
                var rs = {};
                rs.total_unread = 0;
                rs.map_room_msg_unread = {};
                deferred.resolve(rs);
            }
        });
    } else {
        var rs = {};
        rs.total_unread = 0;
        rs.map_room_msg_unread = {};
        deferred.resolve(rs);
    }
    return deferred.promise;
};


// ============================================ //
// ================== NOTIFY ================== //
// ============================================ //

// ============= USER_DEVICE ============= //
// Map[User-Map[FCM_Token-DeviceInfo]]
module.exports.setUserDevice = function(data) {
    var deferred = Q.defer();
    var user_id = data.user_id;
    var fcm_token = data.fcm_token;
    if (user_id && user_id > 0 && fcm_token && fcm_token.length > 0) {
        var data_str = JSON.stringify(data);
        client.hmset(_this.USER_DEVICE_KEY + user_id, fcm_token, data_str, function(err, res) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(res);
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.setUserDeviceAsync = function(data) {
    var deferred = Q.defer();
    var user_id = data.user_id;
    var fcm_token = data.fcm_token;
    if (fcm_token && fcm_token.length > 0 && user_id && user_id > 0) {
        var data_str = JSON.stringify(data);
        client.hmsetAsync(_this.USER_DEVICE_KEY + user_id, fcm_token, data_str).then(function(res) {
            deferred.resolve(res);
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getUserDeviceByUserId = function(user_id) {
    var deferred = Q.defer();
    if (user_id && user_id > 0) {
        client.hgetall(_this.USER_DEVICE_KEY + user_id, function(err, res) {
            if (res) {
                var mapUD = {};
                for (var key in res) {
                    var data_str = res[key];
                    var data = JSON.parse(data_str);
                    mapUD[key] = data;
                }
                deferred.resolve(mapUD);
            } else {
                deferred.resolve(null);
            }
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.deleteUserDevice = function(user_id, fcm_token) {
    var deferred = Q.defer();
    if (user_id && user_id > 0 && fcm_token && fcm_token.length > 0) {
        client.hdel(_this.USER_DEVICE_KEY + user_id, fcm_token, function(err, res) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(res);
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

// ============= NOTIFY ============= //
module.exports.getNextNotifyId = function() {
    var deferred = Q.defer();
    client.incr(_this.ID_KEY + 'notify_id', function(err, id) {
        deferred.resolve(id);
    });
    return deferred.promise;
};

module.exports.setNotify = function(msg) {
    var deferred = Q.defer();
    if (msg.id && msg.id >= 0) {
        var msg_str = JSON.stringify(msg);
        client.set(_this.NOTIFY_KEY + msg.id, msg_str);
        deferred.resolve(msg);
    } else {
        _this.getNextNotifyId().then(function(id) {
            msg.id = id;
            var msg_str = JSON.stringify(msg);
            client.set(_this.NOTIFY_KEY + msg.id, msg_str);
            deferred.resolve(msg);
        });
    }
    return deferred.promise;
};

module.exports.setNotifyAsync = function(msg) {
    var deferred = Q.defer();
    if (msg.id && msg.id >= 0) {
        var msg_str = JSON.stringify(msg);
        client.setAsync(_this.NOTIFY_KEY + msg.id, msg_str).then(function(res) {});
        deferred.resolve(msg);
    } else {
        _this.getNextNotifyId().then(function(id) {
            msg.id = id;
            var msg_str = JSON.stringify(msg);
            client.setAsync(_this.NOTIFY_KEY + msg.id, msg_str).then(function(res) {});
            deferred.resolve(msg);
        });
    }
    return deferred.promise;
};

module.exports.getNotify = function(msg_id) {
    var deferred = Q.defer();
    client.get(_this.NOTIFY_KEY + msg_id, function(err, msg_str) {
        msg = JSON.parse(msg_str);
        deferred.resolve(msg);
    });
    return deferred.promise;
};

module.exports.getListNotify = function(ids) {
    var deferred = Q.defer();
    if (ids) {
        _this.makeListIds(_this.NOTIFY_KEY, ids).then(function(keys) {
            client.mget(keys, function(err, msgs) {
                if (err) { console.log(err) }
                var listMsg = [];
                msgs.forEach(function(msg_str) {
                    msg = JSON.parse(msg_str);
                    listMsg.push(msg);
                });
                deferred.resolve(listMsg);
            });
        });
    } else {
        deferred.resolve(null);
    }
    return deferred.promise;
};

module.exports.getAllListNotify = function() {
    var deferred = Q.defer();
    client.keys(_this.NOTIFY_KEY + "*", function(err, keys) {
        if (err) console.log(err);
        client.mget(keys, function(err, values) {
            if (err) { console.log(err) }
            var listNtf = [];
            values.forEach(function(value) {
                var ntf = JSON.parse(value);
                listNtf.push(ntf);
            });
            deferred.resolve(listNtf);
        });
    });
    return deferred.promise;
};

// ============= USER_NOTIFY ============= //
// Set notify_id of user.
module.exports.addUserNotify = function(user_id, ntf_id) {
    var deferred = Q.defer();
    if (user_id && ntf_id && user_id >= 0 && ntf_id >= 0) {
        client.sadd(_this.USER_NOTIFY_KEY + user_id, ntf_id);
    }
    deferred.resolve(ntf_id);
    return deferred.promise;
};

module.exports.getAllUserNotifyByUserId = function(user_id) {
    var deferred = Q.defer();
    client.smembers(_this.USER_NOTIFY_KEY + user_id, function(err, res) {
        var ntfIds = [];
        res.forEach(function(id) {
            var ntfId = parseInt(id);
            ntfIds.push(ntfId);
        });
        // ntfIds.reverse();
        deferred.resolve(ntfIds);
    });
    return deferred.promise;
};

module.exports.totalUserNotifyByUserId = function(user_id) {
    var deferred = Q.defer();
    client.scard(_this.USER_NOTIFY_KEY + user_id, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

module.exports.existUserNotifyByUserId = function(user_id, ntf_id) {
    // return 1 is exist, 0 is not exist.
    var deferred = Q.defer();
    client.sismember(_this.USER_NOTIFY_KEY + user_id, ntf_id, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

module.exports.removeUserNotifyByUserId = function(user_id, ntf_id) {
    // return 1 is success, 0 is fail or not found.
    var deferred = Q.defer();
    client.srem(_this.USER_NOTIFY_KEY + user_id, ntf_id, function(err, res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

module.exports.getSlideUserNotifyByUserId = function(user_id, page) {
    // return 1 is success, 0 is fail or not found.
    var deferred = Q.defer();
    client.smembers(_this.USER_NOTIFY_KEY + user_id, function(err, res) {
        var rs = {};
        var listNtfIds = [];
        var ntfIds = [];
        var total = res.length;
        var totalPage = Math.ceil(total / paging);
        if (total > 0) {
            if (page == null || page == undefined) {
                page = 1;
            }
            // msgIds.reverse();
            // 1 <= page <= totalPage
            page = Math.min(Math.max(1, page), totalPage);
            // 0 <= min_index <= max_index <= totalPage
            // // Lay xuoi danh sach giam dan.
            // var min_index = Math.max(0, (page - 1) * paging);
            // var max_index = Math.min(min_index + paging, total);
            // Lay nguoc danh sach tang dan.
            var max_index = Math.min(total - ((page - 1) * paging), total);
            var min_index = Math.max(0, max_index - paging);
            ntfIds = res.slice(min_index, max_index);
            if (ntfIds && ntfIds.length > 0) {
                for (var i = ntfIds.length - 1; i >= 0; --i) {
                    var ntfId = parseInt(ntfIds[i]);
                    listNtfIds.push(ntfId);
                }
            }
        }
        rs.user_id = user_id;
        rs.total_page = totalPage;
        rs.page = page;
        rs.ntf_ids = listNtfIds;
        deferred.resolve(rs);
    });
    return deferred.promise;
};

module.exports.getUnreadUserNotifyByUserId = function(user_id) {
    var deferred = Q.defer();
    _this.getUserNtfRead(user_id).then(function(ntf_id) {
        if (ntf_id && ntf_id > 0) {
            client.smembers(_this.USER_NOTIFY_KEY + user_id, function(err, res) {
                var rs = {};
                var total = 0;
                if (res) {
                    var n = res.length;
                    for (var i = n - 1; i >= 0; --i) {
                        var ntfId = parseInt(res[i]);
                        if (ntfId > ntf_id) {
                            ++total;
                        } else {
                            break;
                        }
                    }
                }
                rs.total = total;
                rs.ntfid_last_read = ntf_id;
                deferred.resolve(rs);
            });
        } else {
            var rs = {};
            rs.total = 0;
            rs.ntfid_last_read = 0;
            deferred.resolve(rs);
        }
    });
    return deferred.promise;
};

// ============= USER_NOTIFY_READ ============= //
module.exports.setUserNtfRead = function(user_id, ntf_id) {
    var deferred = Q.defer();
    client.set(_this.USER_NOTIFY_READ_KEY + user_id, ntf_id, function(err, res) {
        if (err) { console.log(err) };
        deferred.resolve(res);
    });
    return deferred.promise;
};

module.exports.setUserNtfReadAsync = function(user_id, ntf_id) {
    var deferred = Q.defer();
    client.setAsync(_this.USER_NOTIFY_READ_KEY + user_id, ntf_id).then(function(res) {
        deferred.resolve(res);
    });
    return deferred.promise;
};

module.exports.getUserNtfRead = function(user_id) {
    var deferred = Q.defer();
    client.get(_this.USER_NOTIFY_READ_KEY + user_id, function(err, ntf_id) {
        if (err) { console.log(err) };
        deferred.resolve(ntf_id);
    });
    return deferred.promise;
};