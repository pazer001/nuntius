'use strict';
const CronJob = require('cron').CronJob;
const resetRedisSessions = require('./reset_redis_sessions');
const resetRedisChats = require('./reset_redis_chats');
const resetRedisActions = require('./reset_redis_actions');

resetRedisSessions();
resetRedisChats();
resetRedisActions();
const resetRedisJob = new CronJob('* * * * *', function() {
    resetRedisSessions();
    resetRedisChats();
    resetRedisActions();
});

resetRedisJob.start();