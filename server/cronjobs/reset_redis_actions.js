'use strict';
const DB    =   require('../DB');
var redis   =   require('redis').createClient();
var moment  =   require('moment');
var tools   =   require('../../tools_functions');

module.exports  =   function() {
    console.time('Actions')
    let queryCompanies  =   `SELECT companies.id FROM nuntius.companies`,
        companiesIdsObject  =   {};
    DB.Q(queryCompanies).then((companiesIds) => {
        companiesIdsObject  =   tools.arrayValueToKey(companiesIds, 'id');
        let actionsQuery    =   `SELECT
                                    actions.action_name,
                                    actions.user_id,
                                    actions.timestamp,
                                    actions.extra_data,
                                    actions.user_ip,
                                    actions.session_hash,
                                    actions.brand_id,
                                    actions.amount,
                                    actions.browser,
                                    sessions.company_id
                                FROM
                                    nuntius.actions
                                JOIN nuntius.sessions ON actions.session_hash = sessions.hash AND sessions.state = '1'`;

        DB.Q(actionsQuery).then((actions) => {
            let actionsLength   =   actions.length,
                actionsIndex    =   0,
                actionsData     =   {},
                companiesIdsObjectLength    =   companiesIdsObject.length,
                companiesIdsObjectIndex     =   0;

            for(actionsIndex; actionsIndex < actionsLength; actionsIndex++) {
                if(!actionsData[actions[actionsIndex].company_id]) actionsData[actions[actionsIndex].company_id]  =   [];
                actions[actionsIndex].timestamp     =   moment(actions[actionsIndex].timestamp).format('YYYY-MM-DD HH:mm:ss.SSS');
                actionsData[actions[actionsIndex].company_id].push(actions[actionsIndex]);
            }

            for(companiesIdsObjectIndex; companiesIdsObjectIndex < companiesIdsObjectLength; companiesIdsObjectIndex++) {
                if(actionsData[companiesIdsObject[companiesIdsObjectIndex]]) {
                    redis.set(`actions:${companiesIdsObject[companiesIdsObjectIndex]}`, JSON.stringify(actionsData[companiesIdsObject[companiesIdsObjectIndex]]))
                } else {
                    redis.del(`actions:${companiesIdsObject[companiesIdsObjectIndex]}`);
                }
            }
            console.timeEnd('Actions')
        })
    })
};