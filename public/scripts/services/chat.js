'use strict';

angular.module('chatme.services', [])
    .factory('chatService', ['$rootScope', function($rootScope) {
        var socket = io('', { query: 'token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMDcsInVzZXJuYW1lIjoiYW5AZ21haWwuY29tX2VtcGxveWVyIiwiZXhwIjoxNTA1NzIwNzk0LCJlbWFpbCI6ImFuQGdtYWlsLmNvbSIsInR5cGVfYXV0aCI6InVwIiwidWlkIjoxMDcsInR5cGVfdXNlciI6ImVtcGxveWVyIiwibmFtZSI6IkVtcGxveWVyIEFuIiwidGltZXN0YW1wIjoxNTA1MTE1OTk0NTgxLCJhdnQiOiIifQ.w1khfOvtGY53tVVWNs9MvJGSGLr1UaNiScfiVFxyb_I' });
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }]);