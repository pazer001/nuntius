'use strict';
const DB    =   require('../DB');
var redis   =   require('redis').createClient();
var moment  =   require('moment');
var tools   =   require('../../tools_functions');

module.exports = function() {
    console.time('Sessions')
    let queryCompanies  =   `SELECT companies.id FROM nuntius.companies`,
        companiesIdsObject  =   {};
    DB.Q(queryCompanies).then((companiesIds) => {
        companiesIdsObject  =   tools.arrayValueToKey(companiesIds, 'id');
        let sessionsQuery    =   `SELECT
                                    sessions.company_id,
                                    sessions.brand_id,
                                    sessions.user_id,
                                    sessions.datetime,
                                    sessions.hash,
                                    sessions.last_activity,
                                    sessions.country_code
                                FROM
                                    nuntius.sessions
                                WHERE
                                    sessions.state = '1'`;

        DB.Q(sessionsQuery).then((sessions) => {
            let sessionsLength   =   sessions.length,
                sessionsIndex    =   0,
                sessionsData     =   {},
                companiesIdsObjectLength    =   companiesIdsObject.length,
                companiesIdsObjectIndex     =   0;

            for(sessionsIndex; sessionsIndex < sessionsLength; sessionsIndex++) {
                if(!sessionsData[sessions[sessionsIndex].company_id]) sessionsData[sessions[sessionsIndex].company_id]  =   [];
                sessionsData[sessions[sessionsIndex].company_id].push(sessions[sessionsIndex]);
            }

            for(companiesIdsObjectIndex; companiesIdsObjectIndex < companiesIdsObjectLength; companiesIdsObjectIndex++) {
                if(sessionsData[companiesIdsObject[companiesIdsObjectIndex]]) {
                    redis.set(`sessions:${companiesIdsObject[companiesIdsObjectIndex]}`, JSON.stringify(sessionsData[companiesIdsObject[companiesIdsObjectIndex]]))
                } else {
                    redis.del(`sessions:${companiesIdsObject[companiesIdsObjectIndex]}`);
                }
            }
            console.log('Sessions Cron');
            console.timeEnd('Sessions')
        })
    })
}