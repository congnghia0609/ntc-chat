// @ts-nocheck
var socketio = require('socket.io'),
    events = require('events'),
    _ = require('underscore'),
    dataService = require('./data_service'),
    Q = require('q'),
    jwtUtil = require('./jwt_util'),
    fcmUtil = require('./fcm_util');

// Instance.
var _this = this;
// Constant Socket Private.
const SK_ERROR = 'SK_Error';
const SK_CONNECT = 'SK_Connect';
const SK_DISCONNECT = 'SK_Disconnect';
const SK_JOIN_ROOM = 'SK_JoinRoom';
const SK_LEAVE_ROOM = 'SK_LeaveRoom';
const SK_HISTORY_MSG = 'SK_HistoryMsg';
const SK_LAST_MSG = 'SK_LastMsg';
const SK_SEARCH_USER = 'SK_SearchUser';
const SK_TRACK_ROOM_MSG_LAST_READ = 'SK_TrackRoomMsgLastRead';
const SK_UNREAD_MSG = 'SK_UnreadMsg';
// Constant Socket Public.
const SK_MESSAGE = 'SK_Message';
// Constant Message.
const MSG_ERROR = 'MSG_Error';
const MSG_CONNECT = 'MSG_Connect';
const MSG_DISCONNECT = 'MSG_Disconnect';
const MSG_IN_ROOM = 'MSG_InRoom';
const MSG_OUT_ROOM = 'MSG_OutRoom';
const MSG_CHAT = 'MSG_Chat';
// Constant Status Message.
const MSG_STATUS_SEND = 'send';
const MSG_STATUS_SEEN = 'seen';
// Constant FCM.
const FCM_INFO = 'FCM_Info';
const FCM_NTF = 'FCM_Ntf';
const FCM_HISTORY_NTF = 'FCM_HistoryNtf';
const FCM_TRACK_NTF_LAST_READ = 'FCM_TrackNtfLastRead';
const FCM_UNREAD_NTF = 'FCM_UnreadNtf';


module.exports = function(server) {

    //Map Socket-Room
    var mapSocketRoom = {
        rooms: {}
    };
    // Map Socket-User.
    var mapSocketUser = {
        users: {}
    };
    // Map Room-MapUser.
    var mapRoomUser = {
        rooms: {}
    };
    // Map User-Online.
    var mapUserOnline = {};

    // Map[UserId-Map[socketId-socket]]
    var mapUserSocket = {};

    //Allow the chatServer to emit events
    var EventEmitter = require('events').EventEmitter;

    var chatServer = {};

    chatServer.io = socketio.listen(server);
    chatServer.io.sockets.on('connection', function(socket) {

        var token = socket.handshake.query.token;
        if (token) {
            jwtUtil.getUserFromToken(token).then(function(user) {
                console.log('==================================== getUserFromToken');
                console.log(user);
                console.log('====================================');
                // Save User info.
                dataService.setUserAsync(user).then(function(result) {}).catch(function(err) {
                    console.log(err);
                });
                // Tracking Socket-User
                console.log('==================================== assignUser');
                console.log('socket.id: ' + socket.id + '  <==> user.id: ' + user.id);
                console.log('====================================');
                mapSocketUser.users[socket.id] = user;
                // Tracking User-Online.
                mapUserOnline[user.id] = new Date().getTime();
                // Tracking User-MapSocket.
                var mapUS = mapUserSocket[user.id];
                if (mapUS) {
                    mapUS[socket.id] = socket;
                    mapUserSocket[user.id] = mapUS;
                } else {
                    mapUS = {};
                    mapUS[socket.id] = socket;
                    mapUserSocket[user.id] = mapUS;
                }

                // Welcome the user
                socket.emit(SK_CONNECT, {
                    type_sk: SK_CONNECT,
                    user: user,
                    content: 'Connected'
                });
            }).catch(function(err) {
                console.log('==================================== getUserFromToken ERROR');
                console.log(err);
                console.log('====================================');
                //Authentication user error.
                console.log('Authentication user error. Token invalid...');
                socket.emit(SK_ERROR, {
                    type_sk: SK_ERROR,
                    content: 'Token invalid.'
                });
                // Disconnect socket.
                console.log('Disconnect socket[' + socket.id + ']...');
                setTimeout(function() {
                    console.log('Disconnect...');
                    socket.disconnect(true);
                }, 2000);
            });

            socket.on(SK_JOIN_ROOM, function(data) {
                chatServer.joinRoom(socket, data);
            });

            socket.on(SK_LEAVE_ROOM, function(data) {
                chatServer.leaveRoom(socket, data);
            });

            socket.on(SK_MESSAGE, function(data) {
                chatServer.sendMessage(socket, data);
            });

            socket.on(SK_LAST_MSG, function(data) {
                chatServer.sendLastMessage(socket, data);
            });

            socket.on(SK_SEARCH_USER, function(data) {
                chatServer.sendSearchUser(socket, data);
            });

            socket.on(SK_HISTORY_MSG, function(data) {
                chatServer.sendHistoryMessage(socket, data);
            });

            socket.on(SK_TRACK_ROOM_MSG_LAST_READ, function(data) {
                chatServer.trackRoomMessageLastRead(socket, data);
            });

            socket.on(SK_UNREAD_MSG, function(data) {
                chatServer.getUnreadMessage(socket, data);
            });

            socket.on(SK_DISCONNECT, function(data) {
                chatServer.disconnect(socket, data);
            });

            socket.on('disconnect', function(reason) {
                chatServer.autoDisconnect(socket, reason);
            });

            //===================================//
            //======= Event Socket Notify =======//
            //===================================//
            socket.on(FCM_INFO, function(data) {
                chatServer.fcmInfo(socket, data);
            });

            socket.on(FCM_NTF, function(data) {
                chatServer.sendNotify(socket, data);
            });

            socket.on(FCM_HISTORY_NTF, function(data) {
                chatServer.sendHistoryNotify(socket, data);
            });

            socket.on(FCM_TRACK_NTF_LAST_READ, function(data) {
                chatServer.trackNotifyLastRead(socket, data);
            });

            socket.on(FCM_UNREAD_NTF, function(data) {
                chatServer.getUnreadNotify(socket, data);
            });

        } else {
            //Authentication user error.
            console.log('Authentication user error. Miss param token...');
            socket.emit(SK_ERROR, {
                type_sk: SK_ERROR,
                content: 'Miss param token.'
            });
            // Disconnect socket.
            console.log('Disconnect socket[' + socket.id + ']...');
            setTimeout(function() {
                console.log('Disconnect...');
                socket.disconnect(true);
            }, 2000);
        }
    });

    //===================================================//
    //===================== NOTIFY =====================//
    //===================================================//
    chatServer.fcmInfo = function(socket, data) {
        var err = -1;
        var msg = "Data invalid. Save FCM infomation fail.";
        var user = mapSocketUser.users[socket.id];
        var fcm_token = data.fcm_token;
        if (user && user.id > 0 && fcm_token && fcm_token.length > 0) {
            data.user_id = user.id;
            dataService.setUserDeviceAsync(data).then(function(res) {});
            err = 0;
            msg = "Save FCM infomation success.";
        }
        // response client.
        var rs = data;
        rs.type_sk = FCM_INFO;
        rs.err = err;
        rs.msg = msg;
        socket.emit(FCM_INFO, rs);
    };

    chatServer.sendHistoryNotify = function(socket, data) {
        var rs = data;
        rs.type_sk = FCM_HISTORY_NTF;
        rs.user_id = 0;
        rs.total_page = 0;
        rs.page = data.page;
        rs.list_ntf = [];
        var user = mapSocketUser.users[socket.id];
        var page = data.page;
        if (user && user.id > 0) {
            rs.user_id = user.id;
            var user_id = user.id;
            // Get list notify_id.
            dataService.getSlideUserNotifyByUserId(user_id, page).then(function(res) {
                if (res && res.ntf_ids && res.ntf_ids.length > 0) {
                    rs.total_page = res.total_page;
                    rs.page = res.page;
                    var ntf_ids = res.ntf_ids;
                    dataService.getListNotify(ntf_ids).then(function(listNtf) {
                        rs.list_ntf = listNtf;
                        socket.emit(FCM_HISTORY_NTF, rs);
                        // console.log(rs);
                    });
                }
            });
        } else {
            socket.emit(FCM_HISTORY_NTF, rs);
            // console.log(rs);
        }
    };

    chatServer.trackNotifyLastRead = function(socket, data) {
        var rs = data;
        var user = mapSocketUser.users[socket.id];
        var err = -1;
        var msg = "Data invalid. Save tracking notify last read fail.";
        var ntf_id = data.ntf_id;
        if (user && user.id > 0 && ntf_id && ntf_id > 0) {
            var user_id = user.id;
            data.user_id = user.id;
            rs.user_id = user.id;
            dataService.setUserNtfReadAsync(user_id, ntf_id).then(function(res) {});
            err = 0;
            msg = "Save tracking notify last read success.";
        }
        // response client.
        rs.type_sk = FCM_TRACK_NTF_LAST_READ;
        rs.err = err;
        rs.msg = msg;
        socket.emit(FCM_TRACK_NTF_LAST_READ, rs);
        // console.log(rs);
    };

    chatServer.getUnreadNotify = function(socket, data) {
        var rs = {};
        if (data) { rs = data };
        rs.type_sk = FCM_UNREAD_NTF;
        var user = mapSocketUser.users[socket.id];
        if (user && user.id > 0) {
            var user_id = user.id;
            data.user_id = user.id;
            rs.user_id = user.id;
            dataService.getUnreadUserNotifyByUserId(user_id).then(function(res) {
                rs.total = res.total;
                rs.ntfid_last_read = res.ntfid_last_read;
                // response client.
                socket.emit(FCM_UNREAD_NTF, rs);
                // console.log(rs);
            });
        } else {
            // response client.
            rs.total = 0;
            rs.ntfid_last_read = 0;
            socket.emit(FCM_UNREAD_NTF, rs);
        }
    };

    // Send notify to RabbitMQ.
    chatServer.sendNotify = function(socket, data) {
        this.emit('sendNotify', data);
    };

    // Receive notify from RabbirMQ and Socket out notify.
    /**
        var data = {
            from_user_id: 1,
            to_user_id: 2,
            notification: {
                title: "New chat message!",
                body: "There is a new message in ntc-chat",
                icon: "/images/profile_placeholder.png",
                click_action: "http://localhost:5000"
            },
        };
     */
    chatServer.broadcastNotify = function(data) {
        var to_user_id = data.to_user_id;
        var notification = data.notification;
        if (to_user_id && to_user_id > 0 && notification) {
            // Get map token of User.
            dataService.getUserDeviceByUserId(to_user_id).then(function(res) {
                if (res) {
                    // Notify via Firebase. OUT_APP.
                    for (var token in res) {
                        var ntf = {};
                        ntf.fcm_token = token;
                        ntf.notification = notification;
                        // Send notify User-Device to Firebase.
                        fcmUtil.sendNotify(ntf).then(function(fcm_res) {});
                    }

                    // Save only 1 notify for 1 user.
                    var msgNtf = data;
                    var timestamp = new Date().getTime();
                    msgNtf.type_sk = FCM_NTF;
                    msgNtf.create = timestamp;
                    msgNtf.update = timestamp;
                    msgNtf.status = "active";
                    dataService.getNextNotifyId().then(function(id) {
                        if (id && id >= 0) {
                            msgNtf.id = id;
                            // Save Notify and User-Notify.
                            dataService.setNotifyAsync(msgNtf).then(function(res) {});
                            dataService.addUserNotify(to_user_id, id).then(function(res) {});
                        }
                    });

                    // If to_user is online, response notify to to_user by Socket. IN_APP.
                    // Get mapUserSocket of to_user. Map[UserId-Map[socketId-socket]]
                    var mapUS = mapUserSocket[to_user_id];
                    if (mapUS) {
                        for (var skId in mapUS) {
                            var sk = mapUS[skId];
                            if (sk && sk.connected && sk.id) {
                                sk.emit(FCM_NTF, msgNtf);
                            }
                        }
                    }
                }
            });
        }
    };

    //===================================================//
    //===================== MESSAGE =====================//
    //===================================================//
    chatServer.joinRoom = function(socket, data) {
        // get user info.
        var from_user = data.from_user;
        var to_user = data.to_user;
        var mapUser = {};
        mapUser[from_user.id] = from_user;
        mapUser[to_user.id] = to_user;
        // Save to_user info if not exist.
        dataService.getUser(to_user.id).then(function(res) {
            if (res && res.id > 0) {
                // User is exist.
            } else { // Save to_user.
                dataService.setUserAsync(to_user).then(function(result) {}).catch(function(err) {
                    console.log(err);
                });
            }
        });
        // Setup room chat.
        dataService.getUserUserRoom(from_user.id, to_user.id).then(function(room_id) {
            // if room exist.
            if (room_id) {
                dataService.getRoom(room_id).then(function(room) {
                    // Update Cache: Map Room-MapUser.
                    mapRoomUser.rooms[room.id] = mapUser;
                    // If currentRooms is exist. Leave old room.
                    var currentRoom = mapSocketRoom.rooms[socket.id];
                    if (currentRoom && currentRoom.id > 0 && currentRoom.id != room_id) {
                        // Leave Room.
                        socket.emit(SK_LEAVE_ROOM, {
                            type_sk: SK_LEAVE_ROOM,
                            from_user_id: from_user.id,
                            to_user_id: to_user.id,
                            room: currentRoom,
                            content: from_user.name + ' leave room.'
                        });
                        var leavingMessage = {
                            type_sk: SK_MESSAGE,
                            type_msg: MSG_OUT_ROOM,
                            from_user_id: from_user.id,
                            to_user_id: to_user.id,
                            room_id: currentRoom.id,
                            content: from_user.name + ' has left.'
                        };
                        socket.leave(currentRoom.id);
                        chatServer.sendMessage(socket, leavingMessage);
                    }
                    // Join Room.
                    mapSocketRoom.rooms[socket.id] = room;
                    socket.join(room.id);
                    socket.emit(SK_JOIN_ROOM, {
                        type_sk: SK_JOIN_ROOM,
                        from_user_id: from_user.id,
                        to_user_id: to_user.id,
                        room: room,
                        content: from_user.name + ' join room.'
                    });
                    var joinMessage = {
                        type_sk: SK_MESSAGE,
                        type_msg: MSG_IN_ROOM,
                        from_user_id: from_user.id,
                        to_user_id: to_user.id,
                        room_id: room.id,
                        content: from_user.name + ' has joined.'
                    };
                    chatServer.sendMessage(socket, joinMessage);
                });
            } else { // create new room.
                console.log('room_id not exist...');
                dataService.createRoom().then(function(room) {
                    // Tracking UserUserRoom.
                    dataService.setUserUserRoomAsync(from_user.id, to_user.id, room.id).then(function(res) {});
                    // Tracking RoomUser.
                    dataService.addRoomUser2UserAsync(room.id, from_user.id, to_user.id).then(function(res) {});
                    // Update Cache: Map Room-MapUser.
                    mapRoomUser.rooms[room.id] = mapUser;

                    // Join Room.
                    mapSocketRoom.rooms[socket.id] = room;
                    socket.join(room.id);
                    socket.emit(SK_JOIN_ROOM, {
                        type_sk: SK_JOIN_ROOM,
                        from_user_id: from_user.id,
                        to_user_id: to_user.id,
                        room: room,
                        content: from_user.name + ' join room.'
                    });

                    var joinMessage = {
                        type_sk: SK_MESSAGE,
                        type_msg: MSG_IN_ROOM,
                        from_user_id: from_user.id,
                        to_user_id: to_user.id,
                        room_id: room.id,
                        content: from_user.name + ' has joined.'
                    };
                    // this.emit('sendMessage', joinMessage);
                    chatServer.sendMessage(socket, joinMessage);
                });
            }
        });
    };

    chatServer.leaveRoom = function(socket, data) {
        var user = mapSocketUser.users[socket.id];
        var room = mapSocketRoom.rooms[socket.id];
        // If user exist in room is send message.
        if (room && room.id > 0) {
            socket.emit(SK_LEAVE_ROOM, {
                type_sk: SK_LEAVE_ROOM,
                from_user_id: user.id,
                to_user_id: data.to_user_id,
                room: room,
                content: user.name + ' leave room.'
            });
            var leavingMessage = {
                type_sk: SK_MESSAGE,
                type_msg: MSG_OUT_ROOM,
                from_user_id: user.id,
                to_user_id: data.to_user_id,
                room_id: room.id,
                content: user.name + ' has left.'
            };
            console.log('[' + user.name + '] leave room[' + room.id + ']...');
            chatServer.sendMessage(socket, leavingMessage);
            socket.leave(mapSocketRoom.rooms[socket.id]);
            delete mapSocketRoom.rooms[socket.id];
        }
    };

    chatServer.autoDisconnect = function(socket, reason) {
        // Delete Socket Room.
        if (mapSocketRoom.rooms[socket.id]) {
            delete mapSocketRoom.rooms[socket.id];
        }
        // Delete UserOnline && SocketUser && User-MapSocket.
        var user = mapSocketUser.users[socket.id];
        if (user) {
            delete mapUserOnline[user.id];
            delete mapSocketUser.users[socket.id];
            // Delete User-MapSocket.
            var mapUS = mapUserSocket[user.id];
            if (mapUS) {
                delete mapUS[socket.id];
                // Update mapUserSocket.
                mapUserSocket[user.id] = mapUS;
            }
        }
    };

    chatServer.disconnect = function(socket, data) {
        var user = mapSocketUser.users[socket.id];
        var room = mapSocketRoom.rooms[socket.id];
        // If user in room, then send message disconnect.
        if (room) {
            console.log(user.name + ' has disconnected server was in room ' + room.name);
            var to_user_id = data != null && data.to_user_id > 0 ? data.to_user_id : 0;
            var message = {
                type_sk: SK_MESSAGE,
                type_msg: MSG_DISCONNECT,
                from_user_id: user.id,
                to_user_id: to_user_id,
                room_id: room.id,
                content: user.name + ' has disconnected.'
            };
            // this.emit('sendMessage', message);
            chatServer.sendMessage(socket, message);
            delete mapSocketRoom.rooms[socket.id];
        }

        // Delete UserOnline && SocketUser && User-MapSocket.
        var user = mapSocketUser.users[socket.id];
        if (user) {
            delete mapUserOnline[user.id];
            delete mapSocketUser.users[socket.id];
            // Delete User-MapSocket.
            var mapUS = mapUserSocket[user.id];
            if (mapUS) {
                delete mapUS[socket.id];
                // Update mapUserSocket.
                mapUserSocket[user.id] = mapUS;
            }
        }
        // Disconnect socket.
        console.log('[' + user.name + '] Disconnect socket[' + socket.id + ']...');
        socket.disconnect(true);
    };

    chatServer.sendLastMessage = function(socket, data) {
        var rs = data;
        var user = mapSocketUser.users[socket.id];
        var page = data.page;
        rs.type_sk = SK_LAST_MSG;
        rs.user_id = 0;
        rs.total_page = 0;
        rs.list_msg = [];
        if (user && user.id > 0) {
            rs.user_id = user.id;
            dataService.getSlideUserLastMsgByUserId(user.id, page).then(function(res) {
                if (res) {
                    rs = res;
                    // Add status online-offline user.
                    var listMsg = rs.list_msg;
                    if (listMsg && listMsg.length > 0) {
                        for (var i in listMsg) {
                            var msg = listMsg[i];
                            var from_user_id = msg.from_user_id;
                            var to_user_id = msg.to_user_id;
                            // Set isOnline.
                            if (from_user_id == user.id) {
                                if (mapUserSocket[to_user_id] && Object.keys(mapUserSocket[to_user_id]).length > 0) {
                                    msg.isOnline = true;
                                } else {
                                    msg.isOnline = false;
                                }
                            } else {
                                if (mapUserSocket[from_user_id] && Object.keys(mapUserSocket[from_user_id]).length > 0) {
                                    msg.isOnline = true;
                                } else {
                                    msg.isOnline = false;
                                }
                            }
                            listMsg[i] = msg;
                        }
                        rs.list_msg = listMsg;
                    }
                    //response client.
                    socket.emit(SK_LAST_MSG, rs);
                    // console.log(rs);
                } else {
                    //response client.
                    socket.emit(SK_LAST_MSG, rs);
                    // console.log(rs);
                }
            });
        } else {
            //response client.
            socket.emit(SK_LAST_MSG, rs);
            // console.log(rs);
        }
    };

    chatServer.sendSearchUser = function(socket, data) {
        var rs = data;
        rs.type_sk = SK_SEARCH_USER;
        rs.user_id = 0;
        rs.list_msg = [];
        var user = mapSocketUser.users[socket.id];
        var name = data.name;
        if (user && user.id > 0 && name && name.length > 0) {
            rs.user_id = user.id;
            dataService.searchUserLastMsgByNameUser(user.id, name).then(function(res) {
                // Add status online-offline user.
                var listMsg = res;
                if (listMsg && listMsg.length > 0) {
                    for (var i in listMsg) {
                        var msg = listMsg[i];
                        var from_user_id = msg.from_user_id;
                        var to_user_id = msg.to_user_id;
                        // Set isOnline.
                        if (from_user_id == user.id) {
                            if (mapUserSocket[to_user_id] && Object.keys(mapUserSocket[to_user_id]).length > 0) {
                                msg.isOnline = true;
                            } else {
                                msg.isOnline = false;
                            }
                        } else {
                            if (mapUserSocket[from_user_id] && Object.keys(mapUserSocket[from_user_id]).length > 0) {
                                msg.isOnline = true;
                            } else {
                                msg.isOnline = false;
                            }
                        }
                        listMsg[i] = msg;
                    }
                    rs.list_msg = listMsg;
                }
                //response client.
                socket.emit(SK_SEARCH_USER, rs);
                // console.log(rs);
            });
        } else {
            //response client.
            socket.emit(SK_SEARCH_USER, rs);
            // console.log(rs);
        }
    };

    chatServer.sendHistoryMessage = function(socket, data) {
        var rs = data;
        rs.type_sk = SK_HISTORY_MSG;
        rs.from_user_id = 0;
        rs.to_user_id = data.to_user_id;
        rs.room_id = 0;
        rs.total_page = 0;
        rs.page = data.page;
        rs.list_msg = [];
        var user = mapSocketUser.users[socket.id];
        var page = data.page;
        var to_user_id = data.to_user_id;
        if (user && user.id > 0 && to_user_id && to_user_id > 0) {
            rs.from_user_id = user.id;
            // Get room_id.
            dataService.getUserUserRoom(user.id, to_user_id).then(function(room_id) {
                if (room_id && room_id > 0) {
                    rs.room_id = room_id;
                    // Get ListMsgIds.
                    dataService.getSlideRoomMsgByRoomId(room_id, page).then(function(roomMsgs) {
                        var msgIds = roomMsgs.msg_ids;
                        if (msgIds && msgIds.length > 0) {
                            // Get ListMsgs.
                            dataService.getListMsgs(msgIds).then(function(msgs) {
                                // Add User Info.
                                if (msgs && msgs.length > 0) {
                                    // Get User Info local cache.
                                    var to_user = mapRoomUser.rooms[room_id] ? mapRoomUser.rooms[room_id][to_user_id] : null;
                                    if (to_user && to_user.id > 0) {
                                        rs.room_id = room_id;
                                        rs.total_page = roomMsgs.total_page;
                                        rs.page = roomMsgs.page;
                                        for (var i in msgs) {
                                            var msgItem = msgs[i];
                                            if (msgItem.from_user_id == user.id) {
                                                msgItem.from_user = user;
                                                msgItem.to_user = to_user;
                                                msgs[i] = msgItem;
                                            } else {
                                                msgItem.from_user = to_user;
                                                msgItem.to_user = user;
                                                msgs[i] = msgItem;
                                            }
                                        }
                                        rs.list_msg = msgs;
                                        socket.emit(SK_HISTORY_MSG, rs);
                                        // console.log(rs);
                                    } else {
                                        // Get User Info from Redis.
                                        dataService.getUser(to_user_id).then(function(to_user) {
                                            rs.room_id = room_id;
                                            rs.total_page = roomMsgs.total_page;
                                            rs.page = roomMsgs.page;
                                            for (var i in msgs) {
                                                var msgItem = msgs[i];
                                                if (msgItem.from_user_id == user.id) {
                                                    msgItem.from_user = user;
                                                    msgItem.to_user = to_user;
                                                    msgs[i] = msgItem;
                                                } else {
                                                    msgItem.from_user = to_user;
                                                    msgItem.to_user = user;
                                                    msgs[i] = msgItem;
                                                }
                                            }
                                            rs.list_msg = msgs;
                                            socket.emit(SK_HISTORY_MSG, rs);
                                            // console.log(rs);
                                        });
                                    }
                                } else {
                                    rs.from_user_id = user.id;
                                    rs.room_id = room_id;
                                    rs.total_page = roomMsgs.total_page;
                                    rs.page = roomMsgs.page;
                                    rs.list_msg = [];
                                    socket.emit(SK_HISTORY_MSG, rs);
                                    // console.log(rs);
                                }
                            });
                        } else {
                            rs.from_user_id = user.id;
                            rs.room_id = room_id;
                            rs.total_page = roomMsgs.total_page;
                            rs.page = roomMsgs.page;
                            rs.list_msg = [];
                            socket.emit(SK_HISTORY_MSG, rs);
                            // console.log(rs);
                        }
                    });
                } else {
                    socket.emit(SK_HISTORY_MSG, rs);
                    // console.log(rs);
                }
            });
        } else {
            socket.emit(SK_HISTORY_MSG, rs);
            // console.log(rs);
        }
    };

    chatServer.trackRoomMessageLastRead = function(socket, data) {
        var rs = data;
        var user = mapSocketUser.users[socket.id];
        var err = -1;
        var msg = "Data invalid. Save tracking room message last read fail.";
        var room_id = data.room_id;
        var msg_id = data.msg_id;
        if (user && user.id > 0 && room_id && room_id > 0 && msg_id && msg_id > 0) {
            data.user_id = user.id;
            dataService.setUserRoomMsgReadAsync(data).then(function(res) {});
            err = 0;
            msg = "Save tracking room message last read success.";
        }
        // response client.
        rs.type_sk = SK_TRACK_ROOM_MSG_LAST_READ;
        rs.err = err;
        rs.msg = msg;
        socket.emit(SK_TRACK_ROOM_MSG_LAST_READ, rs);
        // console.log(rs);
    };

    chatServer.getUnreadMessage = function(socket, data) {
        var rs = {};
        if (data) { rs = data };
        rs.type_sk = SK_UNREAD_MSG;
        var user = mapSocketUser.users[socket.id];
        if (user && user.id > 0) {
            var user_id = user.id;
            data.user_id = user.id;
            rs.user_id = user.id;
            dataService.getUnreadUserRoomMsgReadByUserId(user_id).then(function(res) {
                rs.total_unread = res.total_unread;
                rs.map_room_msg_unread = res.map_room_msg_unread;
                // response client.
                socket.emit(SK_UNREAD_MSG, rs);
                // console.log(rs);
            });
        } else {
            // response client.
            rs.total_unread = 0;
            rs.map_room_msg_unread = 0;
            socket.emit(SK_UNREAD_MSG, rs);
        }
    };


    // Send meassge to RabbitMQ.
    chatServer.sendMessage = function(socket, message) {
        // If room_id == 0, get or create room_id.
        var type_sk = message.type_sk;
        var room_id = message.room_id;
        if (type_sk == SK_MESSAGE && room_id == 0) {
            // Only apply for First Meassage when Employer shortlist Candidate.
            var from_user_id = message.from_user_id;
            var to_user_id = message.to_user_id;
            // Setup room chat.
            dataService.getUserUserRoom(from_user_id, to_user_id).then(function(res_room_id) {
                // if room exist.
                if (res_room_id) {
                    message.room_id = res_room_id;
                    chatServer.emit('sendMessage', message);
                } else { // create new room.
                    console.log('res_room_id not exist...');
                    dataService.createRoom().then(function(room) {
                        // Tracking UserUserRoom.
                        dataService.setUserUserRoomAsync(from_user_id, to_user_id, room.id).then(function(res) {});
                        // Tracking RoomUser.
                        dataService.addRoomUser2UserAsync(room.id, from_user_id, to_user_id).then(function(res) {});

                        message.room_id = room.id;
                        chatServer.emit('sendMessage', message);
                    });
                }
            });
        } else {
            this.emit('sendMessage', message);
        }
    };

    // Receive message from RabbirMQ and Socket out message.
    chatServer.broadcast = function(message) {
        var type_sk = message.type_sk;
        var room_id = message.room_id;
        if (room_id && room_id > 0) {
            // Process message chat.
            if (type_sk == SK_MESSAGE) {
                chatServer.broadcastMessage(room_id, message);
                // console.log('==================================== broadcastMessage SK_MESSAGE');
                // console.log(message);
                // console.log('====================================');
            } else { // Process other message.
                // Broadcast other message in room.
                chatServer.io.to(room_id).emit(SK_MESSAGE, message);
            }
        }
    };

    chatServer.broadcastMessage = function(room_id, message) {
        var type_msg = message.type_msg;
        // Add info message.
        message.created = new Date().getTime();
        message.updated = new Date().getTime();
        message.status = MSG_STATUS_SEND;

        // if type_msg == MSG_CHAT is gen id and save Message.
        if (type_msg == MSG_CHAT) {
            chatServer.broadcastMessageChat(room_id, message);
        } else { // Message other.
            chatServer.broadcastMessageOther(room_id, message);
        }
    };

    // if type_msg == MSG_CHAT is gen id and save Message.
    chatServer.broadcastMessageChat = function(room_id, message) {
        var type_msg = message.type_msg;
        var from_user_id = message.from_user_id;
        var to_user_id = message.to_user_id;

        // clone message.
        var msg = JSON.parse(JSON.stringify(message));
        dataService.getNextMsgId().then(function(msg_id) {
            message.id = msg_id;
            msg.id = msg_id;
            // Save Message.
            dataService.setMsgAsync(msg).then(function(res) {});
            // Tracking RoomMsg.
            dataService.addRoomMsg(room_id, msg.id).then(function(res) {});

            // Response to client.
            // Get User Info local cache.
            var from_user = mapRoomUser.rooms[room_id] ? mapRoomUser.rooms[room_id][from_user_id] : null;
            var to_user = mapRoomUser.rooms[room_id] ? mapRoomUser.rooms[room_id][to_user_id] : null;
            if (from_user && to_user && from_user.id > 0 && to_user.id > 0) {
                message.from_user = from_user;
                message.to_user = to_user;
                // Save User Last Message.
                dataService.setUserLastMsgAsync(message).then(function(res) {});
                // console.log('==================================== Local setUserLastMsgAsync');
                // console.log(message);
                // console.log('====================================');
                // Broadcast message in room.
                // chatServer.io.to(room_id).emit(SK_MESSAGE, message);

                // If To_User && From_User is online, send message.
                // Get mapUserSocket of to_user. Map[UserId-Map[socketId-socket]]
                var mapFromUS = mapUserSocket[from_user_id];
                if (mapFromUS) {
                    for (var skId in mapFromUS) {
                        var sk = mapFromUS[skId];
                        if (sk && sk.connected && sk.id) {
                            sk.emit(SK_MESSAGE, message);
                        }
                    }
                }
                var mapToUS = mapUserSocket[to_user_id];
                if (mapToUS) {
                    for (var skId in mapToUS) {
                        var sk = mapToUS[skId];
                        if (sk && sk.connected && sk.id) {
                            sk.emit(SK_MESSAGE, message);
                        }
                    }
                }
            } else {
                // Get User Info from Redis.
                dataService.getUser(from_user_id).then(function(from_user) {
                    dataService.getUser(to_user_id).then(function(to_user) {
                        message.from_user = from_user;
                        message.to_user = to_user;
                        // Save User Last Message.
                        dataService.setUserLastMsgAsync(message).then(function(res) {});
                        // console.log('==================================== Redis setUserLastMsgAsync');
                        // console.log(message);
                        // console.log('====================================');
                        // Update Cache: Map Room-MapUser.
                        var mapUser = {};
                        mapUser[from_user.id] = from_user;
                        mapUser[to_user.id] = to_user;
                        mapRoomUser.rooms[room_id] = mapUser;
                        // Broadcast message in room.
                        //chatServer.io.to(room_id).emit(SK_MESSAGE, message);

                        // If To_User && From_User is online, send message.
                        // Get mapUserSocket of to_user. Map[UserId-Map[socketId-socket]]
                        var mapFromUS = mapUserSocket[from_user_id];
                        if (mapFromUS) {
                            for (var skId in mapFromUS) {
                                var sk = mapFromUS[skId];
                                if (sk && sk.connected && sk.id) {
                                    sk.emit(SK_MESSAGE, message);
                                }
                            }
                        }
                        var mapToUS = mapUserSocket[to_user_id];
                        if (mapToUS) {
                            for (var skId in mapToUS) {
                                var sk = mapToUS[skId];
                                if (sk && sk.connected && sk.id) {
                                    sk.emit(SK_MESSAGE, message);
                                }
                            }
                        }
                    });
                });
            }
        });
    };

    chatServer.broadcastMessageOther = function(room_id, message) {
        var type_msg = message.type_msg;
        var from_user_id = message.from_user_id;
        var to_user_id = message.to_user_id;
        // Response to client.
        // Get User Info local cache.
        var from_user = mapRoomUser.rooms[room_id] ? mapRoomUser.rooms[room_id][from_user_id] : null;
        var to_user = mapRoomUser.rooms[room_id] ? mapRoomUser.rooms[room_id][to_user_id] : null;
        if (from_user && to_user && from_user.id > 0 && to_user.id > 0) {
            message.from_user = from_user;
            message.to_user = to_user;
            // Broadcast message in room.
            chatServer.io.to(room_id).emit(SK_MESSAGE, message);
        } else {
            // Get User Info from Redis.
            dataService.getUser(from_user_id).then(function(from_user) {
                dataService.getUser(to_user_id).then(function(to_user) {
                    message.from_user = from_user;
                    message.to_user = to_user;
                    // Broadcast message in room.
                    chatServer.io.to(room_id).emit(SK_MESSAGE, message);
                    // Update Cache: Map Room-MapUser.
                    var mapUser = {};
                    mapUser[from_user.id] = from_user;
                    mapUser[to_user.id] = to_user;
                    mapRoomUser.rooms[room_id] = mapUser;
                });
            });
        }
    };

    EventEmitter.call(chatServer);
    _.extend(chatServer, EventEmitter.prototype);

    return chatServer;
};