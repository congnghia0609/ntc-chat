# ntc-chat With NodeJS, Redis, RabbitMQ and Socket.IO. System notification by Firebase.

A **ntc-chat** server that uses **NodeJs** as web server (Express+SocketIO), **Redis** as a storage, **RabbitMQ** as message queue and a **Socket.IO** that uses web sockets for a real time chat experience.  

# A. Setup

Install NodeJs from [http://nodejs.org/](http://nodejs.org/)  
Install Redis from [https://redis.io/](https://redis.io/)  
Install RabbitMQ from [https://www.rabbitmq.com/](https://www.rabbitmq.com/)  
Library SocketIO [https://socket.io/](https://socket.io/)  

## Setup nodejs && npm && nvm

```
# nodejs
sudo apt-get update
## nodejs default
sudo apt-get install nodejs

## nodejs 7.x
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

## nodejs 8.x
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential

## check
node -v


# npm
sudo apt-get install npm

npm --version


# nvm
cd ~
sudo apt-get install build-essential libssl-dev
curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh -o install_nvm.sh
bash install_nvm.sh
source ~/.profile

## check
nvm ls-remote
nvm help

nvm install 7.10.1
nvm alias default 7.10.1
nvm use 7.10.1

or

nvm install 8.9.4
nvm alias default 8.9.4
nvm use 8.9.4
```

## Setup PM2

```
sudo npm install pm2 -g
```


# B. Redis  

## Start Redis  

```
cd redis-3.2.9
src/redis-server redis.conf
or
nohup src/redis-server redis.conf >/dev/null 2>&1 &
```

# C. ntc-chat

## Config file

View and modify file configuration in folder **./config/config.js**  


## Start ntc-chat

```
cd ntc-chat
npm install
# Start app. NODE_ENV = development || testing || staging || production || local
export NODE_ENV=development
node app.js
or
node app.js --port 3000
```

or start node project by PM2.  

```
# list project nodejs.
pm2 list

# Start app. NODE_ENV = development || testing || staging || production || local
export NODE_ENV=development
pm2 start app.js --name ntc-chat
or
pm2 start app.js --port 3000 --name ntc-chat

# view logs
pm2 logs

# restart
pm2 restart <pid>

# stop
pm2 stop <pid>

# remove app.
pm2 delete <pid>
```

Open two browser windows one at localhost:3000  
Start chatting.


# D. ntc-chat document API SocketIO

## 1.1. Convention.

```
// Constant Socket Private.
const SK_ERROR = 'SK_Error';
const SK_CONNECT = 'SK_Connect';
const SK_DISCONNECT = 'SK_Disconnect';
const SK_JOIN_ROOM = 'SK_JoinRoom';
const SK_LEAVE_ROOM = 'SK_LeaveRoom';
const SK_HISTORY_MSG = 'SK_HistoryMsg';
const SK_LAST_MSG = 'SK_LastMsg'
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
```

## 1.2. Socket Connection.

```
var url = 'ntc-chat.example.com';
var chatService = io(url, { query: 'token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlX2F1dGgiOiJ1cCIsImV4cCI6MTUwMjE2NDYwNCwidXNlcm5hbWUiOiJuZ2hpYTJAZ21haWwuY29tIiwidWlkIjoyLCJ0aW1lc3RhbXAiOjE1MDE1NTk4MDQ2MDgsInVzZXJfaWQiOjIsInR5cGVfdXNlciI6ImNhbmRpZGF0ZSIsIm5hbWUiOiJuZ2hpYSB0cmFuIiwiZW1haWwiOiJuZ2hpYTJAZ21haWwuY29tIiwiYXZ0IjoiIn0.j_mITV8Aqa5HD2hOuMzPlEbJxU-mViETsIv555qDmYo' });
```

### 1.2.1. Listen event connect success.

```
chatService.on(SK_CONNECT, function(res) {
    console.log(SK_CONNECT);
    console.log(res);
});

// response data
{
    type_sk: 'SK_Connect',
    user: { 
        id: 2,
        email: 'nghia2@gmail.com',
        name: 'nghia tran',
        type_user: 'candidate',
        avt: '' 
    },
    content: 'Connected' 
}
```

### 1.2.2. Listen event connect error.

```
chatService.on(SK_ERROR, function(res) {
    console.log(SK_ERROR);
    console.log(res);
});

// response data
{
    type_sk: 'SK_Error',
    content: 'Token invalid.' 
}
```

## 1.3. Join Room.

```
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

var message = { from_user: f_user, to_user: t_user };
chatService.emit(SK_JOIN_ROOM, message);
```

### 1.3.1. Listen event JoinRoom.

```
chatService.on(SK_JOIN_ROOM, function(res) {
    console.log(SK_JOIN_ROOM);
    console.log(res);
});

// response data
{
    type_sk: 'SK_JoinRoom',
    from_user_id: 2,
    to_user_id: 3,
    room: { id: 6, name: 'room_6' },
    content: '[nghia tran] join room.' 
}
// NOTE: Remember save info room_id to usage.
```


## 1.4. Chat message.

```
// sendChatMessage
var message = {
    type_sk: SK_MESSAGE,
    type_msg: MSG_CHAT,
    from_user_id: 2,
    to_user_id: 3,
    room_id: currentRoom,
    content: "This is content message chat."
};
chatService.emit(SK_MESSAGE, message);
```

### 1.4.1. Listen event Chat Message.

```
chatService.on(SK_MESSAGE, function(res) {
    console.log(SK_MESSAGE);
    console.log(res);
});

// response data
{
    type_sk: 'SK_Message',
    type_msg: 'MSG_Chat',
    from_user_id: 2,
    to_user_id: 3,
    room_id: 6,
    content: 'This is content message chat.',
    created: 1501746695024,
    updated: 1501746695025,
    from_user: {
        id: 2,
        email: 'nghia2@gmail.com',
        name: 'nghia tran',
        type_user: 'candidate',
        avt: '' },
    to_user: {
        id: 3,
        email: 'user3@gmail.com',
        name: 'user 3',
        type_user: 'candidate',
        avt: '' 
    },
    status: 'send',
    id: 49
}
```

## 1.5. Leave Room.

```
var message = {
    type_sk: SK_LEAVE_ROOM,
    from_user_id: 2,
    to_user_id: 3,
    room_id: currentRoom,
    content: 'leave room.'
};
chatService.emit(SK_LEAVE_ROOM, message);
```

### 1.5.1. Listen event Leave Room.

```
chatService.on(SK_LEAVE_ROOM, function(res) {
    console.log(SK_LEAVE_ROOM);
    console.log(res);
    currentRoom = 0;
});

// response data

```

## 1.6. Disconnect socket.

```
// Send message disconnect.
var message = {
    type_sk: SK_DISCONNECT,
    from_user_id: 2,
    to_user_id: 3,
    room_id: currentRoom,
    content: 'disconnect'
};
chatService.emit(SK_DISCONNECT, message);

// Disconnects the socket manually.
chatService.disconnect();

or

chatService.close();
```

### 1.6.1. Listen event Disconnect socket.

```
chatService.on(SK_DISCONNECT, function(res) {
    console.log(SK_DISCONNECT);
    console.log(res);
});

// response data.

```

## 1.7. Last Message Chat.

```
// send message get List Message.
var message = { page: 1 };
chatService.emit(SK_LAST_MSG, message);
```

### 1.7.1. Listen event Last Message Chat.

```
chatService.on(SK_LAST_MSG, function(res) {
    console.log(SK_LAST_MSG);
    console.log(res);
});

// response data.
{
    user_id: 2,
    total_page: 1,
    page: 1,
    list_msg:
    [
        {
            type_sk: 'SK_Message',
            type_msg: 'MSG_Chat',
            from_user_id: 2,
            to_user_id: 3,
            room_id: 6,
            content: 'eeee',
            created: 1501856450568,
            updated: 1501856450568,
            status: 'send',
            id: 80,
            from_user: {
                id: 2,
                email: 'nghia2@gmail.com',
                name: 'nghia tran',
                type_user: 'candidate',
                avt: '' },
            to_user: {
                id: 3,
                email: 'user3@gmail.com',
                name: 'user 3',
                type_user: 'candidate',
                avt: '' 
            },
            isOnline: false 
        }
    ],
    type_sk: 'SK_LastMsg' 
}
```

## 1.8. History Message Chat.

```
// send message get History Message.
var message = { page: 1, to_user_id: 3 };
chatService.emit(SK_HISTORY_MSG, message);
```

### 1.8.1. Listen event History Message Chat.

```
chatService.on(SK_HISTORY_MSG, function(res) {
    console.log(SK_HISTORY_MSG);
    console.log(res);
});

// response data.
{
    page: 1,
    to_user_id: 3,
    type_sk: 'SK_HistoryMsg',
    from_user_id: 2,
    room_id: '6',
    total_page: 5,
    list_msg:
    [
        {
            type_sk: 'SK_Message',
            type_msg: 'MSG_Chat',
            from_user_id: 2,
            to_user_id: 3,
            room_id: 6,
            content: 'kkk',
            created: 1501754645428,
            updated: 1501754645428,
            status: 'send',
            id: 50,
            from_user: {
                id: 2,
                email: 'nghia2@gmail.com',
                name: 'nghia tran',
                type_user: 'candidate',
                avt: '' },
            to_user: {
                id: 3,
                email: 'user3@gmail.com',
                name: 'user 3',
                type_user: 'candidate',
                avt: '' 
            }
        },
        {
            type_sk: 'SK_Message',
            type_msg: 'MSG_Chat',
            from_user_id: 2,
            to_user_id: 3,
            room_id: 6,
            content: 'eeeeeeeeee',
            created: 1501841857171,
            updated: 1501841857171,
            status: 'send',
            id: 72,
            from_user: {
                id: 2,
                email: 'nghia2@gmail.com',
                name: 'nghia tran',
                type_user: 'candidate',
                avt: '' },
            to_user: {
                id: 3,
                email: 'user3@gmail.com',
                name: 'user 3',
                type_user: 'candidate',
                avt: '' 
            }
        },
        {
            type_sk: 'SK_Message',
            type_msg: 'MSG_Chat',
            from_user_id: 2,
            to_user_id: 3,
            room_id: 6,
            content: 'eeeeeeeeeeee',
            created: 1501842699583,
            updated: 1501842699583,
            status: 'send',
            id: 73,
            from_user: {
                id: 2,
                email: 'nghia2@gmail.com',
                name: 'nghia tran',
                type_user: 'candidate',
                avt: '' },
            to_user: {
                id: 3,
                email: 'user3@gmail.com',
                name: 'user 3',
                type_user: 'candidate',
                avt: '' 
            }
        }
    ]
}
```

## 1.9. Search Message Chat by name user.

```
// send message Search Message.
var message = { name: "user" };
chatService.emit(SK_SEARCH_USER, message);
```

### 1.9.1. Listen event Search Message Chat.

```
chatService.on(SK_SEARCH_USER, function(res) {
    console.log(SK_SEARCH_USER);
    console.log(res);
});

// response data.
{
    name: 'user',
    type_sk: 'SK_SearchUser',
    user_id: 2,
    list_msg:
    [
        {
            type_sk: 'SK_Message',
            type_msg: 'MSG_Chat',
            from_user_id: 2,
            to_user_id: 3,
            room_id: 6,
            content: 'eeee',
            created: 1501856450568,
            updated: 1501856450568,
            status: 'send',
            id: 80,
            from_user:
            {
                id: 2,
                email: 'nghia2@gmail.com',
                name: 'nghia tran',
                type_user: 'candidate',
                avt: '' 
            },
            to_user:
            {
                id: 3,
                email: 'user3@gmail.com',
                name: 'User 3',
                type_user: 'candidate',
                avt: '' 
            },
            isOnline: false
        }
    ]
}
```

## 1.10. Tracking Last Message Read.

```
// send data Tracking Last Message Read.
var message = {
    user_id: 65,
    room_id: 9,
    msg_id: 1
};
chatService.emit(SK_TRACK_ROOM_MSG_LAST_READ, message);
```

### 1.10.1. Listen event Last Message Chat.

```
chatService.on(SK_TRACK_ROOM_MSG_LAST_READ, function(res) {
    console.log(SK_TRACK_ROOM_MSG_LAST_READ);
    console.log(res);
});

// response data.
{
    user_id: 65,
    room_id: 9,
    msg_id: 1,
    type_sk: 'SK_TrackRoomMsgLastRead',
    err: 0,
    msg: 'Save tracking room message last read success.'
}
```

## 1.11. Get Message UnRead.

```
// send data Tracking Last Message Read.
var message = { user_id: 65 };
chatService.emit(SK_UNREAD_MSG, message);
```

### 1.11.1. Listen event Get Message UnRead.

```
chatService.on(SK_UNREAD_MSG, function(res) {
    console.log(SK_UNREAD_MSG);
    console.log(res);
});

// response data.
{
    user_id: 65,
    type_sk: 'SK_UnreadMsg',
    total_unread: 11,
    map_room_msg_unread: {
        '9': {
            room_id: 9,
            msgid_last_read: 1,
            total_room_unread: 11
        }
    }
}
```
  
  

# E. ntc-notification document API SocketIO
  
## 2.1. Send FCM infomation.

```
// send message FCM infomation.
var message = {
    user_id: 1,
    fcm_token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    devide_id: "123456789", // imei or uuid.
    os: "iOS",
    model: "iPhone 7 plus",
    app_type: "ntc",
};
chatService.emit(FCM_INFO, message);
```
  
### 2.1.1. Listen event FCM infomation.

```
chatService.on(FCM_INFO, function(res) {
    console.log(FCM_INFO);
    console.log(res);
});

// response data.
{
    type_sk:  "FCM_Info",
    err: 0,
    msg: "Save FCM infomation success.",
    user_id: 1,
    fcm_token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    devide_id: "123456789", // imei or uuid.
    os: "iOS",
    model: "iPhone 7 plus",
    app_type: "ntc",
}
```
  
## 2.2. Send FCM Notify.

```
// send message FCM Notify.
var message = {
    from_user_id: 1,
    to_user_id: 2,
    notification: {
        title: "New chat message!",
        body: "There is a new message in ntc-chat",
        icon: "/images/profile_placeholder.png",
        click_action: "http://localhost:5000"
    },
};
chatService.emit(FCM_NTF, message);
```
  
### 2.2.1. Listen event Send FCM Notify.

```
chatService.on(FCM_NTF, function(res) {
    console.log(FCM_NTF);
    console.log(res);
});

// response data.
{
    type_sk: "FCM_Ntf"
    from_user_id: 1,
    to_user_id: 2,
    notification: {
        title: "New chat message!",
        body: "There is a new message in ntc-chat",
        icon: "/images/profile_placeholder.png",
        click_action: "http://localhost:5000"
    },
    create: 1502351135283,
    update: 1502351135283,
    status: 'active',
    id: 4
}
```
  
  
## 2.3. History Notify User.

```
// send message get History Message.
var message = { page: 1 };
chatService.emit(FCM_HISTORY_NTF, message);
```
  
### 2.3.1. Listen event History Notify User.

```
chatService.on(FCM_HISTORY_NTF, function(res) {
    console.log(FCM_HISTORY_NTF);
    console.log(res);
});

// response data.
{
    page: 1,
    type_sk: 'FCM_HistoryNtf',
    user_id: 65,
    total_page: 1,
    list_ntf: [
        {
            from_user_id: 65,
            to_user_id: 65,
            notification: {
                title: "Save FCM info",
                body: "Save FCM infomation successfully.",
                icon: "/images/profile_placeholder.png",
                click_action: "http://localhost:5000"
            },
            create: 1502351135283,
            update: 1502351135283,
            status: 'active',
            id: 4
        },
        {
            from_user_id: 65,
            to_user_id: 65,
            notification: {
                title: "Save FCM info",
                body: "Save FCM infomation successfully.",
                icon: "/images/profile_placeholder.png",
                click_action: "http://localhost:5000"
            },
            create: 1502351148009,
            update: 1502351148009,
            status: 'active',
            id: 5
        },
        {
            from_user_id: 65,
            to_user_id: 65,
            notification: {
                title: "Save FCM info",
                body: "Save FCM infomation successfully.",
                icon: "/images/profile_placeholder.png",
                click_action: "http://localhost:5000"
            },
            create: 1502351174782,
            update: 1502351174782,
            status: 'active',
            id: 6
        }
    ]
}
```
  
## 2.4. Tracking Notify Last Read.

```
// send data Tracking Notify Last Read.
var message = { ntf_id: 1 };
chatService.emit(FCM_TRACK_NTF_LAST_READ, message);
```
  
### 2.4.1. Listen event Tracking Notify Last Read.

```
chatService.on(FCM_TRACK_NTF_LAST_READ, function(res) {
    console.log(FCM_TRACK_NTF_LAST_READ);
    console.log(res);
});

// response data.
{
    ntf_id: 1,
    user_id: 65,
    type_sk: 'FCM_TrackNtfLastRead',
    err: 0,
    msg: 'Save tracking notify last read success.'
}
```
  
## 2.5. Get Notify UnRead.

```
// send data Get Notify UnRead.
var message = { user_id: 65 };
chatService.emit(FCM_UNREAD_NTF, message);
```
  
### 2.5.1. Listen event Get Notify UnRead.

```
chatService.on(FCM_UNREAD_NTF, function(res) {
    console.log(FCM_UNREAD_NTF);
    console.log(res);
});

// response data.
{
    user_id: 65,
    type_sk: 'FCM_UnreadNtf',
    total: 15,
    ntfid_last_read: '1'
}
```