'use strict';
var DB      =   require('../../DB');
var mysql   =   require('mysql');

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
    
    sendBanner(bannerId, sessionHash, companyId) {
        let sendBannerPromise   =   new Promise((resolve, reject) => {
            let returnData  =   {};
            if(!bannerId || !sessionHash || !companyId) {
                returnData.code =   400;
                reject(returnData)
            } else {
                let query       =   `INSERT INTO nuntius.banners_actions (banners_actions.banner_id, banners_actions.session_hash, banners_actions.company_id) VALUES(${bannerId}, '${sessionHash}', ${companyId});`;
                DB.Q(query).then((data) => {
                    if(DB.lastInsertedId()) {
                        returnData.code =   200;
                    } else {
                        returnData.code =   400;
                    }
                    resolve(returnData)
                })
            }
        })
        return sendBannerPromise;
    }
}

const banners      =   new Banners();
module.exports  =   banners;