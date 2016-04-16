'use strict';
var DB      =   require('../../DB');
var mysql   =   require('mysql');
var redis   =   require('redis').createClient();
var moment  =   require('moment');
// var async = require('asyncawait/async');
// var await = require('asyncawait/await');

class Chat {
    keepSession(sessionHash) {
        let datetime    =   moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS');
        let query   =   `UPDATE nuntius.sessions SET sessions.last_activity = UTC_TIMESTAMP(3) WHERE sessions.hash = '${sessionHash}'`;
        DB.Q(query);
    }

    postMessageRedis(sessionHash) {
        let chatsQuery   =   `SELECT * FROM nuntius.chats WHERE chats.session_hash = '${sessionHash}'`,
            companyId;
        DB.Q(chatsQuery).then((chats) => {
            companyId   =   chats[0].company_id;
            let chatsRedis  =   {};
            chatsRedis[sessionHash]  =   chats[0];
            return redis.set(`chats:${companyId}`, JSON.stringify(chatsRedis));
        }).then(() => {
            let messagesQuery = `SELECT * FROM nuntius.messages WHERE messages.session_hash = '${sessionHash}'`;
            DB.Q(messagesQuery).then((messages) => {
                let messagesRedis  =   {};
                for(let i = 0; i < messages.length; i++) {
                    if(!messagesRedis[messages[i].session_hash]) messagesRedis[messages[i].session_hash] = [];
                    messagesRedis[messages[i].session_hash].push(messages[i])
                }
                redis.set(`messages:${companyId}`, JSON.stringify(messagesRedis))
            })
        })


    }

    postMessage(sessionHash, message, source) {
        let that    =   this;
        return new Promise(function(resolve) {
            let datetime    =   moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS'),
            responseData    =   {},
            query           =   `INSERT INTO nuntius.messages
                                (session_hash, source, message, datetime)
                                VALUES(${mysql.escape(sessionHash)}, ${mysql.escape(source)}, ${mysql.escape(message)}, '${datetime}')`;
            return DB.Q(query).then((data) => {
                if(DB.lastInsertedId()) {
                    that.postMessageRedis(sessionHash);
                    responseData    =   {
                        code: 200,
                        text: 'Message added successfully.'
                    }
                } else {
                    responseData    =   {
                        code: 400,
                        text: 'Error Occurred'
                    }
                }

                resolve(responseData);
            });
        });
    }

    getSessionsRedis(companyId) {
        return new Promise((resolve) => {
            redis.get(`sessions:${companyId}`, (err, sessions) => {
                sessions    =   JSON.parse(sessions) || {};
                resolve(sessions)
            });
        })
    }

    getSessions(companyId) {
        let data    =   {}, that = this;
        return new Promise((resolve) => {
            companyId   =   Number(mysql.escape(companyId));
            if(!companyId) {
                data['code']    =   400;
                data['text']    =   'Problem Occurred';
                resolve(data);
            }

            that.getSessionsRedis(companyId).then((sessions) => {
                let sessionsLength  =   Object.keys(sessions).length, data;
                if(sessionsLength) {
                    data = {
                        dataName: 'sessions',
                        code: 200,
                        data: sessions
                    };
                    resolve(data);
                } else {
                    let query   =   `SELECT sessions.hash, sessions.id, sessions.brand_id, sessions.user_id, sessions.datetime FROM nuntius.sessions WHERE sessions.state = '1' AND sessions.company_id = ${companyId} AND sessions.last_activity IS NOT NULL ORDER BY sessions.last_activity ASC`;
                    DB.Q(query).then((queryData) => {
                        let data    =   {};
                        if(queryData) {
                            let responseData    =   {};
                            for (let i in queryData) {
                                responseData[queryData[i].hash] =   queryData[i];
                            }

                            data    =   {
                                dataName: 'sessions',
                                code: 200,
                                data: responseData
                            }
                        } else {
                            data    =   {
                                code: 400,
                                data: {}
                            }
                        }
                        resolve(data);
                    });
                }
            })


        })
    }

    getChatsRedis(companyId) {
        return new Promise((resolve) => {
            redis.get(`chats:${companyId}`, (err, chats) => {
                chats   =   JSON.parse(chats) || {};
                resolve(chats)
            });
        })
    }

    getChats(companyId) {
        let data    =   {}, that = this;

        return new Promise(function(resolve, reject) {
            companyId   =   Number(mysql.escape(companyId));
            if(!companyId) {
                data['dataName'] =  'chats';
                data['code']    =   400;
                data['text']    =   'Problem Occurred';
                resolve(data);
            }


            that.getChatsRedis(companyId).then((chats) => {
                let chatsLength =   Object.keys(chats).length, data = {};
                if(chatsLength) {
                    data    =   {
                        dataName: 'chats',
                        code: 200,
                        data: chats
                    };
                    resolve(data)
                } else {
                    let query   =   `SELECT chats.session_hash, chats.session_id, chats.brand_id, chats.user_id, chats.last_message AS datetime, chats.user_messages, chats.agent_messages FROM nuntius.chats WHERE chats.state = '1' AND chats.company_id = ${companyId} ORDER BY datetime ASC`;
                    DB.Q(query).then((queryData) => {
                        let data    =   {};
                        if(queryData) {
                            let responseData    =   {};
                            for (let i in queryData) {
                                responseData[queryData[i].session_hash] =   queryData[i];
                            }

                            data    =   {
                                dataName: 'chats',
                                code: 200,
                                data: responseData
                            }
                        } else {
                            data    =   {
                                code: 400,
                                data: {}
                            }
                        }
                        resolve(data);
                    });
                }
            })



        });
    }
    
    getData(companyId, chatHashes) {
        let that    =   this, i = 0, responseData = {};
        const paz= new Promise((resolve) => {
            Promise
                .all([that.getChats(companyId), that.getSessions(companyId), that.getMessages(companyId, chatHashes)])
                .then((data) => {
                    for(i; i < data.length; i++) {
                        responseData[data[i].dataName]  =   data[i];
                    }
                    resolve(responseData)
                })
        })
        return paz;
    }

    askForSessionRedis(hash) {
        let query   =   `SELECT * FROM nuntius.sessions WHERE sessions.hash = '${hash}'`;
        DB.Q(query).then((data) => {
            let companyId   =   data[0].company_id;
            redis.get(`sessions:${companyId}`, (err, sessions) => {
                sessions    =   JSON.parse(sessions) || {};
                sessions[data[0].hash]  =   data[0];
                redis.set(`sessions:${companyId}`, JSON.stringify(sessions))
            })
        })
    }

    askForSession(requestIp, brand, userId, hash, countryCode) {
        this.keepSession(hash);
        let that    =   this;
        return new Promise(function (resolve) {
            let query = `SELECT brands.id FROM nuntius.brands WHERE brands.id = ${brand} AND brands.ip = '${requestIp}'`;
            DB.Q(query).then((data) => {
                if (data) {
                    let datetime    =   moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS'),
                        query = `INSERT INTO nuntius.sessions (sessions.brand_id, sessions.user_id, sessions.hash, sessions.country_code, sessions.datetime, sessions.state) VALUES(${brand}, '${userId}', '${hash}', '${countryCode}', '${datetime}', '1')`,
                        result  =   {};
                    DB.Q(query).then((data) => {
                        result    =   {sessionId: DB.lastInsertedId(), sessionHash: hash};
                        that.askForSessionRedis(hash);
                        resolve(result)
                    })
                } else {
                    resolve('false')
                }
            })
        });
    }

    deleteSessionRedis(hash) {
        client.hset(`sessions:${hash}`, {
            'state': 0
        })
    }

    deleteSession(requestIp, hash) {
        let deleteSessionPromise = new Promise(function (resolve) {
            this.deleteSessionRedis(hash);
            let query = `UPDATE nuntius.sessions SET sessions.state = '0' WHERE sessions.hash = '${hash}'`;
            DB.Q(query).then((data) => {
                if(data) {
                    let result  =   {
                        code: 200,
                        text: 'Session Terminated Successfully'
                    }
                } else {
                    let result  =   {
                        code: 400,
                        text: 'Session Terminating Failed'
                    }
                }
                resolve(result)
            })
        });
        return deleteSessionPromise;
    }

    postAction(actionName, userId, apiKey) {
        let askForChatPromise = new Promise(function (resolve, reject) {
            let query = `SELECT brands.id FROM nuntius.brands WHERE brands.brand = ${brand} AND brands.api_key = '${apiKey}'`;
            let result  =   {};
            DB.Q(query).then((data) => {
                if (data) {
                    let query = `INSERT INTO nuntius.actions (actions.action_name, actions.user_id) VALUES(${actionName}, ${userId})`;
                    DB.Q(query).then((data) => {
                        if(DB.lastInsertedId()) {
                            let result  =   {
                                code: 200,
                                text: 'Action added successfully'
                            }
                        } else {
                            let result  =   {
                                code: 400,
                                text: 'Action added failed'
                            }
                        }
                        resolve(result)
                    })
                } else {
                    resolve('false')
                }
            })
        });
        return askForChatPromise;
    }

    getMessagesRedis(companyId, chatsSessions) {
        var sessionsHashes  =   (typeof chatsSessions == 'object' ? chatsSessions.join("','") : [chatsSessions]);
        let hashes  =   [], i = 0, sessionsHashesLength = sessionsHashes.length;
        for(i; i < sessionsHashesLength; i++) {
            hashes[sessionsHashes[i]]    =   true;
        }
        return new Promise((resolve) => {
            redis.get(`messages:${companyId}`, (err, messages) => {
                messages    =   JSON.parse(messages);

                let messagesRedis   =   {};
                for(let i in messages) {
                    // conolse.log(hashes[i])
                    if(!hashes[i]) continue;

                    if(!messagesRedis[i]) messagesRedis[i] = []
                    messagesRedis[i]    =   messages[i]
                }

                resolve(messagesRedis)
            })
        })
    }

    getMessages(companyId, chatsSessions) {
        let that    =   this;
        return new Promise(function (resolve, reject) {
            if(!chatsSessions) {
                let result = {
                    dataName: 'messages',
                    code: 400,
                    text: 'No chat has been selected'
                };
                resolve(result);
            }

            that.getMessagesRedis(companyId, chatsSessions).then((messages) => {
                if(Object.keys(messages).length) {
                    let result = {
                        dataName: 'messages',
                        code: 200,
                        data: messages
                    }
                    resolve(result)
                } else {
                    var sessionsHashes  =   (typeof chatsSessions == 'object' ? chatsSessions.join("','") : chatsSessions);
                    let query = `SELECT * FROM nuntius.messages WHERE messages.session_hash IN('${sessionsHashes}')`;
                    let result, responseData = {};
                    DB.Q(query).then((data) => {
                        if(data) {
                            for (var i in data) {
                                if (!responseData[data[i].session_hash]) {
                                    responseData[data[i].session_hash] = [];
                                }
                                responseData[data[i].session_hash].push(data[i]);
                            }
                            if (responseData) {
                                result = {
                                    dataName: 'messages',
                                    code: 200,
                                    data: responseData
                                }
                            } else {
                                result = {
                                    dataName: 'messages',
                                    code: 400,
                                    text: 'Session Terminating Failed'
                                }
                            }
                        }
                        resolve(result)

                    })
                }
            })


        });
    }
}

const chat      =   new Chat();
module.exports  =   chat;


