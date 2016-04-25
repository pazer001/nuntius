'use strict';
var DB      =   require('../../DB');
var mysql   =   require('mysql');
var redis   =   require('redis').createClient();
var moment  =   require('moment');

class Banners {
    getBanners(companyId) {
        let getBannersPromise  =   new Promise(function(resolve, reject) {
            companyId   =   mysql.escape(companyId);
            let dataReturn    =   {};
            if(!companyId) {
                dataReturn    =   {
                    code: 401,
                    test: 'Missing Parameter'
                };
                resolve(data)
            }

            let query   =   `SELECT banners.id, banners.company_id, banners.banner_data, banners.brand_id, banners.name FROM nuntius.banners WHERE company_id = ${companyId}`;
            DB.Q(query).then((data) => {
                if(data.length) {
                    dataReturn    =   {
                        code: 200,
                        data: data
                    }
                } else {
                    dataReturn    =   {
                        code: 400,
                        text: 'No Banners',
                        data: []
                    }
                }
                resolve(dataReturn);
            });
        });
        return getBannersPromise;
    }

    getBannersActions(companyId, sessionsHash) {
        return new Promise((resolve) => {
            redis.get(`bannersActions:${companyId}`, (err, bannersActions) => {
                bannersActions  =   JSON.parse(bannersActions) || [];
                resolve(bannersActions[sessionsHash]);
            })
        })
    }

    sendBannerRedis(companyId) {
        let query   =   `SELECT
                            banners_actions.session_hash,
                            banners_actions.user_id,
                            banners_actions.datetime,
                            banners.banner_data
                        FROM
                            nuntius.banners_actions
                        JOIN nuntius.sessions ON sessions. HASH = banners_actions.session_hash
                        JOIN nuntius.banners ON banners_actions.banner_id = banners.id
                        AND sessions.state = '1'
                        WHERE
                            banners_actions.company_id = '${companyId}'`;

        DB.Q(query).then((bannersActions) => {
            let bannersActionsLength  =   bannersActions.length,
                bannersActionsIndex   =   0,
                redisData       =   {};
            for(bannersActionsIndex; bannersActionsIndex < bannersActionsLength; bannersActionsIndex++) {
                if(!redisData[bannersActions[bannersActionsIndex].session_hash]) redisData[bannersActions[bannersActionsIndex].session_hash]    =   [];
                bannersActions[bannersActionsIndex].datetime    =   moment(bannersActions[bannersActionsIndex].datetime).format('YYYY-MM-DD HH:mm:ss');
                redisData[bannersActions[bannersActionsIndex].session_hash].push(bannersActions[bannersActionsIndex])
            }

            redis.set(`bannersActions:${companyId}`, JSON.stringify(redisData));
        })
    }

    sendBanner(bannerId, sessionHash, companyId) {
        let that    =   this;
        let sendBannerPromise   =   new Promise((resolve, reject) => {
            let returnData  =   {};
            if(!bannerId || !sessionHash || !companyId) {
                returnData.code =   400;
                reject(returnData)
            } else {

                let query       =   `INSERT INTO nuntius.banners_actions (banners_actions.banner_id, banners_actions.session_hash, banners_actions.company_id) VALUES(${bannerId}, '${sessionHash}', ${companyId});`;
                DB.Q(query).then((data) => {
                    if(DB.lastInsertedId()) {
                        that.sendBannerRedis(companyId);
                        returnData.code =   200;
                    } else {
                        returnData.code =   400;
                    }
                    resolve(returnData)
                })
            }
        });
        return sendBannerPromise;
    }
}

const banners   =   new Banners();
module.exports  =   banners;