var redis = require("redis");
var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = redis.createClient();

client.on("error", function(err) {
    console.log("Error " + err);
});

var set_size = 20;

client.sadd("bigset", "a member");
client.sadd("bigset", "another member");

while (set_size > 0) {
    client.sadd("bigset", "member " + set_size);
    set_size -= 1;
}

// multi chain with an individual callback
client.multi()
    .scard("bigset")
    .smembers("bigset")
    .keys("*", function(err, replies) {
        // NOTE: code in this callback is NOT atomic
        // this only happens after the the .exec call finishes.
        client.mget(replies, redis.print);
    })
    .dbsize()
    .exec(function(err, replies) {
        console.log("MULTI got " + replies.length + " replies");
        replies.forEach(function(reply, index) {
            console.log("Reply " + index + ": " + reply.toString());
        });
    });