'use strict';
const DB    =   require('../DB');
var redis   =   require('redis').createClient();
var moment  =   require('moment');
var tools   =   require('../../tools_functions');

module.exports = function() {
    console.time('Sessions');
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
            let sessionsLength              =   sessions.length,
                sessionsIndex               =   0,
                sessionsData                =   {},
                companiesIdsObjectLength    =   companiesIdsObject.length,
                companiesIdsObjectIndex     =   0,
                companiesWithData           =   {};

            for(sessionsIndex; sessionsIndex < sessionsLength; sessionsIndex++) {
                if(!sessionsData[sessions[sessionsIndex].hash]) sessionsData[sessions[sessionsIndex].hash]  =   [];
                sessions[sessionsIndex].last_activity                   =   moment(sessions[sessionsIndex].last_activity).format('YYYY-MM-DD HH:mm:ss.SSS');
                sessions[sessionsIndex].datetime                        =   moment(sessions[sessionsIndex].datetime).format('YYYY-MM-DD HH:mm:ss.SSS');
                sessionsData[sessions[sessionsIndex].hash]              =   sessions[sessionsIndex];
                companiesWithData[sessions[sessionsIndex].company_id]   =   true;
            }

            for(companiesIdsObjectIndex; companiesIdsObjectIndex < companiesIdsObjectLength; companiesIdsObjectIndex++) {
                if(companiesWithData[companiesIdsObject[companiesIdsObjectIndex]]) {
                    redis.set(`sessions:${companiesIdsObject[companiesIdsObjectIndex]}`, JSON.stringify(sessionsData))
                } else {
                    redis.del(`sessions:${companiesIdsObject[companiesIdsObjectIndex]}`);
                }
            }
            console.timeEnd('Sessions')
        })
    })
}