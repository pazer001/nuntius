'use strict';
var redis   =   require('redis').createClient();
var moment  =   require('moment');
var tools   =   require('../../tools_functions');
const DB    =   require('../DB');

module.exports = function() {
    console.time('Chats');
    let queryCompanies  =   `SELECT companies.id FROM nuntius.companies`,
        companiesIdsObject  =   {};
    DB.Q(queryCompanies).then((companiesIds) => {
        companiesIdsObject  =   tools.arrayValueToKey(companiesIds, 'id');
        let chatsQuery    =   `SELECT
                                    chats.last_message,
                                    chats.brand_id,
                                    chats.company_id,
                                    chats.session_hash,
                                    chats.user_messages,
                                    chats.agent_messages,
                                    chats.country_code,
                                    chats.user_id,
                                    chats.datetime
                                FROM
                                    nuntius.chats
                                JOIN nuntius.sessions ON chats.session_hash = sessions.hash AND sessions.state = '1'`;
        DB.Q(chatsQuery).then((chats) => {
            let chatsLength   =   chats.length,
                chatsIndex    =   0,
                chatsData     =   {},
                companiesIdsObjectLength    =   companiesIdsObject.length,
                companiesIdsObjectIndex     =   0;

            for(chatsIndex; chatsIndex < chatsLength; chatsIndex++) {
                if(!chatsData[chats[chatsIndex].company_id]) chatsData[chats[chatsIndex].company_id]  =   {};
                if(!chatsData[chats[chatsIndex].company_id][chats[chatsIndex].session_hash]) chatsData[chats[chatsIndex].company_id][chats[chatsIndex].session_hash]    =   {};
                chatsData[chats[chatsIndex].company_id][chats[chatsIndex].session_hash] =   chats[chatsIndex];
            }
            
            for(companiesIdsObjectIndex; companiesIdsObjectIndex < companiesIdsObjectLength; companiesIdsObjectIndex++) {

                if(chatsData[companiesIdsObject[companiesIdsObjectIndex]]) {
                    redis.set(`chats:${companiesIdsObject[companiesIdsObjectIndex]}`, JSON.stringify(chatsData[companiesIdsObject[companiesIdsObjectIndex]]))
                } else {
                    redis.del(`chats:${companiesIdsObject[companiesIdsObjectIndex]}`);
                }
            }
            console.timeEnd('Chats')
        })
    })
};