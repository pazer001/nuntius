'use strict';
var DB      =   require('../../DB');
var mysql   =   require('mysql');
var redis  =   require('redis').createClient();
var moment  =   require('moment');

class Client {
    keepSessionRedis(sessionHash, companyId, datetime) {
        if(!sessionHash || !companyId || !datetime) return;
        redis.get(`sessions:${companyId}`, (err, sessions) => {
            sessions    =   JSON.parse(sessions)
            for(var i in sessions) {
                if(sessions[i].hash == sessionHash) {
                    sessions[i].last_activity   =   datetime;
                    break;
                }
            }
            redis.set(`sessions:${companyId}`, JSON.stringify(sessions))
        })
    }

    keepSession(sessionHash, companyId) {
        let datetime    =   moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS');
        let query   =   `UPDATE nuntius.sessions SET sessions.last_activity = '${datetime}' WHERE sessions.hash = '${sessionHash}'`;
        DB.Q(query);
        this.keepSessionRedis(sessionHash, companyId, datetime)
    }

    getLatestMessagesForSessionHash(lastTimestamp, sessionHash, companyId) {
        return new Promise((resolve) => {
            redis.get(`messages:${companyId}`, (err, sessions) => {
                sessions    =   JSON.parse(sessions);
                if(!sessions || !sessions[sessionHash]) {resolve([]); return}
                let sessionsIndex   =   0,
                    sessionsLength  =   sessions[sessionHash].length,
                    returnData      =   [],
                    datetime,
                    lastDatetime;

                for(sessionsIndex; sessionsIndex < sessionsLength; sessionsIndex++) {
                    datetime        =   new Date(sessions[sessionHash][sessionsIndex].datetime).getTime();
                    lastDatetime    =   new Date(lastTimestamp).getTime();
                    if(moment(datetime).isAfter(lastDatetime)) {
                        returnData.push(sessions[sessionHash][sessionsIndex])
                    }
                }
                resolve(returnData)
            })
        });

    }

    chatAndBannerLastMessages(lastTimestamp, sessionHash, lastBannerView, companyId) {
        let that    =   this;
        let data    =   {};
        let getMessagePromise  =   new Promise(function(resolve, reject) {
            if(!sessionHash) {
                data    =   {
                    code: 400,
                    text: 'No Token'
                };
                resolve(data);
                return;
            }

            let bannersController   =   require('../banners/index'),
                returnData          =   {};
            Promise
                .all([
                that.getLatestMessagesForSessionHash(lastTimestamp, sessionHash, companyId),
                bannersController.getBannersActions(companyId, sessionHash)]
                )
                .then((data) => {
                    returnData    =   {
                        code: 200,
                        dataChat: data[0],
                        dataBanner: data[1]
                    }
                    resolve(returnData)
                });



            that.keepSession(sessionHash, companyId);
            lastTimestamp   =   mysql.escape(lastTimestamp);
            sessionHash     =   mysql.escape(sessionHash);

            let query       =   `(SELECT messages.source, messages.message, messages.agent_id, messages.user_id, DATE_FORMAT(messages.datetime, '%Y-%m-%d %H:%i:%s.%f') AS datetime, 'chat' AS type FROM nuntius.messages WHERE messages.datetime > ${lastTimestamp} AND messages.session_hash = ${sessionHash} ORDER BY messages.datetime ASC)
                                UNION
                                (SELECT 'Agent', banners.banner_data, '', banners_actions.user_id, banners_actions.datetime, 'banner' AS type FROM nuntius.banners_actions JOIN nuntius.banners ON banners_actions.banner_id = banners.id WHERE banners_actions.session_hash = ${sessionHash} AND banners_actions.datetime > '${lastBannerView}')`;

            DB.Q(query).then((data) => {
                if(data) {
                    let parsedDataChat  =   [], parsedDataBanner  =   [];
                    for(let i in data) {
                        if(data[i].type == 'chat') {
                            parsedDataChat.push(data[i])
                        } else {
                            parsedDataBanner.push(data[i])
                        }
                    }
                    data    =   {
                        code: 200,
                        dataChat: parsedDataChat,
                        dataBanner: parsedDataBanner
                    }
                } else {
                    data    =   {
                        code: 400,
                        text: 'Error getting data'
                    }
                }
                resolve(data);
            });
        });
        return getMessagePromise;
    }

    askForSessionRedis(sessionsHash, companyId, data) {
        // if(!sessionHash || !companyId || !datetime) return;
        redis.get(`sessions:${companyId}`, (err, sessions) => {
            sessions    =   JSON.parse(sessions) || {};
            sessions[sessionsHash]  =   data;
            redis.set(`sessions:${companyId}`, JSON.stringify(sessions))
        });
    }

    askForSession(requestIp, brand, userId, hash, countryCode) {
        // this.keepSession(hash);
        let that    =   this;
        return new Promise(function (resolve) {
            let query = `SELECT brands.id FROM nuntius.brands WHERE brands.id = ${brand} AND brands.ip = '${requestIp}'`;
            DB.Q(query).then((data) => {
                if (data) {
                    let datetime    =   moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS'),
                        query = `INSERT INTO nuntius.sessions (sessions.brand_id, sessions.user_id, sessions.hash, sessions.country_code, sessions.datetime, sessions.state) VALUES(${brand}, '${userId}', '${hash}', '${countryCode}', '${datetime}', '1')`,
                        result  =   {};
                    return DB.Q(query).then(() => {
                        query   =   `SELECT * FROM nuntius.sessions WHERE sessions.hash = '${hash}'`;
                        DB.Q(query).then((data) => {
                            result  =   {
                                sessionHash: hash,
                                companyId: data[0].company_id
                            };
                            that.askForSessionRedis(result.sessionHash, result.companyId, data[0]);
                            resolve(result)
                        })
                    })



                } else {
                    resolve('false')
                }
            })
        });
    }
}

const client        =   new Client();
module.exports      =   client;


