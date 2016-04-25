'use strict';
var redis   =   require('redis').createClient();
var moment  =   require('moment');

module.exports = function() {
    console.time('chats');
    redis.keys('chats:*', (err, chatsCompaniesKeys) => {
        let chatsCompaniesItem                  =   0,
            chatsCompaniesLength                =   chatsCompaniesKeys.length,
            chatsCompanyDataParsed              =   {},
            chatsCompaniesItemIndex,
            companyId,
            chatsCompanyDataParsedIndex         =   0,
            chatsCompanyDataParsedKeys          =   {},
            chatsCompanyDataParsedKeysLength    =   0;
        for(chatsCompaniesItem; chatsCompaniesItem < chatsCompaniesLength; chatsCompaniesItem++) {
            companyId   =   chatsCompaniesKeys[chatsCompaniesItem].split(':')[1];
            chatsCompaniesItemIndex   =   chatsCompaniesItem;
            redis.get(chatsCompaniesKeys[chatsCompaniesItem], (err, chatsCompanyData) => {
                chatsCompanyDataParsed  =   JSON.parse(chatsCompanyData);
                    chatsCompanyDataParsedKeys          =   Object.keys(chatsCompanyDataParsed),
                    chatsCompanyDataParsedKeysLength    =   chatsCompanyDataParsedKeys.length;
                for(chatsCompanyDataParsedIndex; chatsCompanyDataParsedIndex < chatsCompanyDataParsedKeysLength; chatsCompanyDataParsedIndex++) {
                    if(moment(chatsCompanyDataParsed[chatsCompanyDataParsedKeys[chatsCompanyDataParsedIndex]].last_message).isBefore(moment.utc().subtract(20, 'minutes').format('YYYY-MM-DD HH:mm:ss'))) {
                        delete chatsCompanyDataParsed[chatsCompanyDataParsedKeys[chatsCompanyDataParsedIndex]];
                    }
                };
                redis.set(chatsCompaniesKeys[chatsCompaniesItemIndex], JSON.stringify(chatsCompanyDataParsed));
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
                console.timeEnd('chats')
            })
        }
    })
};