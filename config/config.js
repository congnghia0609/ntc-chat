process.env['NODE_ENV'] = process.env.NODE_ENV || 'local';

module.exports = function() {
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                "port": 3000,
                "rb_key_chat": "chat",
                "amqp_url": "amqp://username:password@localhost:5672/",
                "JWT_SECRET_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                // redis://user:secret@localhost:6379/
                "redis_url": "redis://127.0.0.1:6379/",
                "paging": 10,
                "firebase_server_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "rb_key_notify": "notify",
            };

        case 'testing':
            return {
                "port": 3000,
                "rb_key_chat": "chat",
                "amqp_url": "amqp://username:password@localhost:5672/",
                "JWT_SECRET_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                // redis://user:secret@localhost:6379/
                "redis_url": "redis://127.0.0.1:6379/",
                "paging": 10,
                "firebase_server_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "rb_key_notify": "notify",
            };

        case 'staging':
            return {
                "port": 3000,
                "rb_key_chat": "chat",
                "amqp_url": "amqp://username:password@localhost:5672/",
                "JWT_SECRET_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                // redis://user:secret@localhost:6379/
                "redis_url": "redis://127.0.0.1:6379/",
                "paging": 10,
                "firebase_server_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "rb_key_notify": "notify",
            };

        case 'production':
            return {
                "port": 3000,
                "rb_key_chat": "chat",
                "amqp_url": "amqp://username:password@localhost:5672/",
                "JWT_SECRET_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                // redis://user:secret@localhost:6379/
                "redis_url": "redis://127.0.0.1:6379/",
                "paging": 10,
                "firebase_server_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "rb_key_notify": "notify",
            };

        case 'local':
            return {
                "port": 3000,
                "rb_key_chat": "chat",
                "amqp_url": "amqp://username:password@localhost:5672/",
                "JWT_SECRET_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                // redis://user:secret@localhost:6379/
                "redis_url": "redis://127.0.0.1:6379/",
                "paging": 10,
                "firebase_server_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "rb_key_notify": "notify",
            };

        default: // Local
            return {
                "port": 3000,
                "rb_key_chat": "chat",
                "amqp_url": "amqp://username:password@localhost:5672/",
                "JWT_SECRET_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                // redis://user:secret@localhost:6379/
                "redis_url": "redis://127.0.0.1:6379/",
                "paging": 10,
                "firebase_server_key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "rb_key_notify": "notify",
            };
    }
};