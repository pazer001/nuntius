'use strict';
var DB      =   require('../../DB');
var mysql   =   require('mysql');
var moment  =   require('moment');
var redis   =   require('redis').createClient();

class Action {
    postActionRedis(companyId) {
        let query   =   `SELECT * FROM nuntius.actions WHERE actions.company_id = '${companyId}' AND actions.state = '1'`,
            actions =   {}

        DB.Q(query).then((data) => {
            redis.set(`actions:${companyId}`, JSON.stringify(data));
        })
    }

    postAction(sessionHash, actionName, extraData, amount, userIp, browser, companyId) {
        let that    =   this;
        return new Promise(function (resolve) {
            let query = `INSERT INTO nuntius.actions (actions.session_hash, actions.action_name, actions.extra_data, actions.amount, actions.user_ip, actions.browser, actions.state) VALUES('${sessionHash}', '${actionName}', '${extraData}', ${amount}, '${userIp}', '${browser}', '1')`,
                result  =   {};

            DB.Q(query).then(() => {
                that.postActionRedis(companyId);
                if(DB.lastInsertedId()) {
                    result  =   {
                        code: 200,
                        text: 'Action added successfully'
                    }
                } else {
                    result  =   {
                        code: 400,
                        text: 'Action added failed'
                    }
                }
                resolve(result)
            })
        })
    }

    getActionsRedis(companyId) {
        return new Promise((resolve) => {
            redis.get(`actions:${companyId}`, (err, actions) => {
                resolve(JSON.parse(actions))
            })
        })
    }

    getActions(companyId) {
        let that    =   this;
        return new Promise((resolve) => {
            let result  =   {};
            that.getActionsRedis(companyId).then((actions) => {
                if(actions && actions.length) {
                    result  =   {
                        dataName: 'actions',
                        code: 200,
                        data: actions
                    };
                    resolve(result);
                } else {
                    let query   =   `SELECT actions.id, actions.session_hash, actions.action_name, actions.extra_data, actions.amount, actions.user_ip, actions.browser, actions.user_id, actions.brand_id, actions.timestamp FROM nuntius.actions WHERE actions.company_id = ${companyId} AND actions.state = '1'`;

                    DB.Q(query).then((data) => {
                        if(data && data.length) {
                            result  =   {
                                dataName: 'actions',
                                code: 200,
                                data: data
                            }
                        } else {
                            result  =   {
                                dataName: 'actions',
                                code: 400,
                                text: 'No Actions',
                                data: data
                            }
                        }
                        resolve(result)
                    })
                }
            });
        });


    }
}

const action      =   new Action();
module.exports  =   action;

