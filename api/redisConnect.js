const redis = require('redis');
const redisConnect = redis.createClient();

redisConnect.on('connect', function () {
    console.log('Redis default connection open to 127.0.0.1:6379');
});

redisConnect.on('error', function (err) {
    console.log('Redis ' + err);
});
