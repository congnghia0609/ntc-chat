'use strict';

// @ts-ignore
angular.module('chatme.controllers')
    .controller('ChatController', ['$scope', 'chatService',
        function($scope, chatService) {
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

            $scope.messages = [];

            var currentRoom = 9;

            var f_user = {};
            f_user.id = 95; //65;
            f_user.email = "nghia1@gmail.com";
            f_user.name = "nghia tran";
            f_user.type_user = "employer";
            f_user.avt = "";
            var t_user = {};
            t_user.id = 3;
            t_user.email = "user3@gmail.com";
            t_user.name = "User 3";
            t_user.type_user = "candidate";
            t_user.avt = "";

            $scope.sendChatMessage = function() {
                if ($scope.chatMessage) {
                    var message = {
                        type_sk: SK_MESSAGE,
                        type_msg: MSG_CHAT,
                        from_user_id: f_user.id,
                        to_user_id: t_user.id,
                        room_id: currentRoom,
                        content: $scope.chatMessage
                    };
                    chatService.emit(SK_MESSAGE, message);
                    $scope.chatMessage = '';
                }
            };

            $scope.leaveRoom = function() {
                var message = {
                    type_sk: SK_LEAVE_ROOM,
                    from_user_id: f_user.id,
                    to_user_id: t_user.id,
                    room_id: currentRoom,
                    content: 'leave room.'
                };
                chatService.emit(SK_LEAVE_ROOM, message);
            };

            $scope.disconnect = function() {
                var message = {
                    type_sk: SK_DISCONNECT,
                    from_user_id: f_user.id,
                    to_user_id: t_user.id,
                    room_id: currentRoom,
                    content: 'disconnect'
                };
                chatService.emit(SK_DISCONNECT, message);
            };

            chatService.on(SK_CONNECT, function(res) {
                console.log(SK_CONNECT);
                console.log(res);
                res.colour = 'alert-success';
                $scope.user = {
                    id: res.user.id,
                    nickName: res.user.name
                };
                $scope.nickName = res.user.name;
                console.log('message.nickName: ' + res.user.name);

                // Message join room.
                var message = { from_user: f_user, to_user: t_user };
                chatService.emit(SK_JOIN_ROOM, message);

                // Send FCM infomation.
                var fcm_info = {
                    user_id: f_user.id,
                    fcm_token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    devide_id: "123456789", // imei or uuid.
                    os: "iOS 7",
                    model: "7 plus",
                    app_type: "ntc",
                };
                chatService.emit(FCM_INFO, fcm_info);
            });

            chatService.on(FCM_INFO, function(res) {
                console.log(FCM_INFO);
                console.log(res);
                var msg = {};
                if (res.user_id == $scope.user.id) {
                    msg.colour = 'alert-success';
                } else {
                    msg.colour = 'alert-info';
                }
                msg.text = '[FCM_INFO] ' + $scope.user.nickName + ': ' + res.msg;
                $scope.messages.push(msg);

                // Send notify.
                var msg_ntf = {
                    from_user_id: f_user.id,
                    to_user_id: f_user.id,
                    notification: {
                        title: "Save FCM info",
                        body: "Save FCM infomation successfully.",
                        icon: "/images/profile_placeholder.png",
                        click_action: "http://localhost:5000"
                    },
                };
                chatService.emit(FCM_NTF, msg_ntf);

                // Tracking last notify.
                var ntf_last_read = {
                    ntf_id: 1
                };
                chatService.emit(FCM_TRACK_NTF_LAST_READ, ntf_last_read);
            });

            chatService.on(FCM_TRACK_NTF_LAST_READ, function(res) {
                console.log(FCM_TRACK_NTF_LAST_READ);
                console.log(res);
                var msg = {};
                if (res.user_id == $scope.user.id) {
                    msg.colour = 'alert-success';
                } else {
                    msg.colour = 'alert-info';
                }
                msg.text = '[FCM_TRACK_NTF_LAST_READ]: err=' + res.err + ', msg=' + res.msg + ', ntf_id=' + res.ntf_id;
                $scope.messages.push(msg);

                // Get unread notify.
                var get_ntf_unread = {
                    user_id: $scope.user.id
                };
                chatService.emit(FCM_UNREAD_NTF, get_ntf_unread);
            });

            chatService.on(FCM_UNREAD_NTF, function(res) {
                console.log(FCM_UNREAD_NTF);
                console.log(res);
                var msg = {};
                if (res.user_id == $scope.user.id) {
                    msg.colour = 'alert-success';
                } else {
                    msg.colour = 'alert-info';
                }
                msg.text = '[FCM_UNREAD_NTF]: total=' + res.total + ', ntfid_last_read=' + res.ntfid_last_read;
                $scope.messages.push(msg);
            });

            chatService.on(FCM_NTF, function(res) {
                console.log(FCM_NTF);
                console.log(res);
                var msg = {};
                if (res.from_user_id == $scope.user.id) {
                    msg.colour = 'alert-success';
                } else {
                    msg.colour = 'alert-info';
                }
                msg.text = '[FCM_NTF] [BODY]: ' + res.notification.body;
                $scope.messages.push(msg);
            });

            chatService.on(SK_MESSAGE, function(res) {
                console.log(SK_MESSAGE);
                console.log(res);
                var msg = {};
                if (res.from_user_id == $scope.user.id) {
                    msg.colour = 'alert-success';
                } else {
                    msg.colour = 'alert-info';
                }
                msg.text = $scope.user.nickName + ': ' + res.content;
                $scope.messages.push(msg);
            });

            chatService.on(SK_JOIN_ROOM, function(res) {
                console.log(SK_JOIN_ROOM);
                console.log(res);
                currentRoom = res.room.id;
                $scope.messages = [];
                $scope.messages.push({
                    text: 'Welcome to : [' + res.room.name + ']',
                    colour: 'alert-warning'
                });

                // Get Last Message.
                var message1 = { page: 1 };
                chatService.emit(SK_LAST_MSG, message1);

                // Get History Message.
                var message2 = { page: 1, to_user_id: t_user.id };
                chatService.emit(SK_HISTORY_MSG, message2);

                // Search Message by User Name.
                var message3 = { name: "user" };
                chatService.emit(SK_SEARCH_USER, message3)

                // get History Notify.
                var message4 = { page: 1 };
                chatService.emit(FCM_HISTORY_NTF, message4);

                // Tracking Room Message Last Read.
                var message5 = {
                    user_id: $scope.user.id,
                    room_id: currentRoom,
                    msg_id: 1
                };
                chatService.emit(SK_TRACK_ROOM_MSG_LAST_READ, message5);
            });

            chatService.on(SK_TRACK_ROOM_MSG_LAST_READ, function(res) {
                console.log(SK_TRACK_ROOM_MSG_LAST_READ);
                console.log(res);
                var msg = {};
                if (res.user_id == $scope.user.id) {
                    msg.colour = 'alert-success';
                } else {
                    msg.colour = 'alert-info';
                }
                msg.text = '[SK_TRACK_ROOM_MSG_LAST_READ]: err=' + res.err + ', msg=' + res.msg + ', msg_id=' + res.msg_id;
                $scope.messages.push(msg);

                // Get unread mesage.
                var get_msg_unread = {
                    user_id: $scope.user.id
                };
                chatService.emit(SK_UNREAD_MSG, get_msg_unread);
            });

            chatService.on(SK_UNREAD_MSG, function(res) {
                console.log(SK_UNREAD_MSG);
                console.log(res);
                var msg = {};
                if (res.user_id == $scope.user.id) {
                    msg.colour = 'alert-success';
                } else {
                    msg.colour = 'alert-info';
                }
                msg.text = '[SK_UNREAD_MSG]: total_unread=' + res.total_unread + ', map_room_msg_unread=' + JSON.stringify(res.map_room_msg_unread);
                $scope.messages.push(msg);
            });


            chatService.on(FCM_HISTORY_NTF, function(res) {
                console.log(FCM_HISTORY_NTF);
                console.log(res);
                if (res) {
                    var listNtf = res.list_ntf;
                    if (listNtf && listNtf.length > 0) {
                        for (var i in listNtf) {
                            var msgItem = listNtf[i];
                            var msg = {};
                            msg.colour = 'alert-info';
                            msg.text = '[FCM_HISTORY_NTF] ' + $scope.user.nickName + ': ' + msgItem.notification.body;
                            $scope.messages.push(msg);
                        }
                    }
                }
            });

            chatService.on(SK_SEARCH_USER, function(res) {
                console.log(SK_SEARCH_USER);
                console.log(res);
                if (res) {
                    var listMsg = res.list_msg;
                    if (listMsg && listMsg.length > 0) {
                        for (var i in listMsg) {
                            var msgItem = listMsg[i];
                            var msg = {};
                            if (msgItem.from_user_id == $scope.user.id) {
                                msg.colour = 'alert-success';
                            } else {
                                msg.colour = 'alert-info';
                            }
                            msg.text = '[Search] ' + $scope.user.nickName + ': ' + msgItem.content;
                            $scope.messages.push(msg);
                        }
                    }
                }
            });

            chatService.on(SK_HISTORY_MSG, function(res) {
                console.log(SK_HISTORY_MSG);
                console.log(res);
                if (res) {
                    var listMsg = res.list_msg;
                    if (listMsg && listMsg.length > 0) {
                        for (var i in listMsg) {
                            var msgItem = listMsg[i];
                            var msg = {};
                            if (msgItem.from_user_id == $scope.user.id) {
                                msg.colour = 'alert-success';
                            } else {
                                msg.colour = 'alert-info';
                            }
                            msg.text = '[History] ' + $scope.user.nickName + ': ' + msgItem.content;
                            $scope.messages.push(msg);
                        }
                    }
                }
            });

            chatService.on(SK_LEAVE_ROOM, function(res) {
                console.log(SK_LEAVE_ROOM);
                console.log(res);
                currentRoom = 0;
            });

            chatService.on(SK_LAST_MSG, function(res) {
                console.log(SK_LAST_MSG);
                console.log(res);
                if (res) {
                    var listMsg = res.list_msg;
                    if (listMsg && listMsg.length > 0) {
                        for (var i in listMsg) {
                            var msgItem = listMsg[i];
                            var msg = {};
                            if (msgItem.from_user_id == $scope.user.id) {
                                msg.colour = 'alert-success';
                            } else {
                                msg.colour = 'alert-info';
                            }
                            msg.text = '[LastMsg] ' + $scope.user.nickName + ': ' + msgItem.content;
                            $scope.messages.push(msg);
                        }
                    }
                }
            });

            chatService.on(SK_ERROR, function(res) {
                console.log(SK_ERROR);
                console.log(res);
            });
        }
    ]);