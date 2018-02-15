'use strict';

angular.module('chatme.controllers')
    .controller('RoomController', ['$scope', '$modal', '$http', 'chatService',
        function($scope, $modal, $http, chatService) {
            // Constant Socket
            const SK_ERROR = 'SK_Error';
            const SK_CONNECT = 'SK_Connect';
            const SK_DISCONNECT = 'SK_Disconnect';
            const SK_JOIN_ROOM = 'SK_JoinRoom';
            const SK_LEAVE_ROOM = 'SK_LeaveRoom';
            const SK_MESSAGE = 'SK_Message';
            // Constant Message
            const MSG_ERROR = 'MSG_Error';
            const MSG_CONNECT = 'MSG_Connect';
            const MSG_DISCONNECT = 'MSG_Disconnect';
            const MSG_IN_ROOM = 'MSG_InRoom';
            const MSG_OUT_ROOM = 'MSG_OutRoom';
            const MSG_CHAT = 'MSG_Chat';

            var f_user = {};
            f_user.id = 2;
            f_user.email = "nghia2@gmail.com";
            f_user.name = "nghia tran";
            f_user.type_user = "candidate";
            f_user.avt = "";
            var t_user = {};
            t_user.id = 3;
            t_user.email = "user3@gmail.com";
            t_user.name = "user 3";
            t_user.type_user = "candidate";
            t_user.avt = "";

            var currentRoom = 'Lobby';

            var roomsRequest = $http({
                method: 'GET',
                url: '/rooms'
            });

            roomsRequest.success(function(data) {
                // console.log(data);
                $scope.rooms = data.rooms;
                // console.log($scope.rooms);
                currentRoom = $scope.rooms[0].name;
            });

            roomsRequest.error(function(data, status, headers, config) {});

            $scope.isActive = function(room) {
                return room.name == currentRoom;
            };

            $scope.joinRoom = function(room) {
                chatService.emit(SK_JOIN_ROOM, { from_user: f_user, to_user: t_user });
            };

            $scope.createRoomDialog = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/createRoomModal.html',
                    controller: 'ModalRoomController'
                });

                modalInstance.result.then(function(roomName) {
                    var room = {
                        name: roomName
                    };
                    currentRoom = room.name;
                    $scope.rooms.push(room);
                    // chatService.emit('createRoom', room);
                }, function() {

                });
            };

            chatService.on(SK_JOIN_ROOM, function(res) {
                currentRoom = res.room.name;
            });

            // chatService.on('newRoom', function(room) {
            //     $scope.rooms.push(room);
            // });

        }
    ]);