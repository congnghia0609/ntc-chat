'use strict';

angular.module('chatme.controllers')
    .controller('NickNameController', ['$scope', 'chatService',
        function($scope, chatService) {
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

            $scope.changeNickname = function() {
                if ($scope.nickName) {
                    chatService.emit('changeNickname', $scope.nickName);
                }
            };

            chatService.on(SK_CONNECT, function(res) {
                $scope.nickName = res.user.name;
                $scope.$broadcast('flash');
            });

            chatService.on('nicknameChanged', function(newNickName) {
                $scope.$broadcast('flash');
            });

        }
    ]);