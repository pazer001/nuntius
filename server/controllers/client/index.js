'use strict';
var DB      =   require('../../DB');
var mysql   =   require('mysql');
// var client  =   require('redis').createClient();
var moment  =   require('moment');

class Client {
    keepSession(sessionHash) {
        let datetime    =   moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS');
        // this.keepSessionRedis(sessionHash, datetime);
        let query   =   `UPDATE nuntius.sessions SET sessions.last_activity = UTC_TIMESTAMP(3) WHERE sessions.hash = '${sessionHash}'`;
        DB.Q(query);
    }

    chatAndBannerLastMessages(sessionId, lastTimestamp, sessionHash, lastBannerView) {
        let that    =   this;
        let data    =   {};

        let getMessagePromise  =   new Promise(function(resolve, reject) {
            if(!sessionHash) {
                data    =   {
                    code: 400,
                    text: 'No Token'
                };
                resolve(data);
            }
            that.keepSession(sessionHash);
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
}

const client        =   new Client();
module.exports      =   client;


