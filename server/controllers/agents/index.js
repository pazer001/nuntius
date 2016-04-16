'use strict';
var DB      =   require('../../DB');
var mysql   =   require('mysql');

class Agents {
    login(email, password, companyId) {
        let loginPromise  =   new Promise(function(resolve, reject) {
            email       =   mysql.escape(email);
            password    =   mysql.escape(password);
            companyId   =   mysql.escape(companyId);
            let dataReturn    =   {};
            if(!email || !password || !companyId) {
                dataReturn    =   {
                    code: 401,
                    test: 'Missing Parameter'
                };
                resolve(data)
            }

            let query   =   `SELECT * FROM nuntius.agents WHERE email=${email} AND password = ${password} AND company_id = ${companyId}`;
            DB.Q(query).then((data) => {
                if(data.length) {
                    dataReturn    =   {
                        code: 200,
                        text: 'Login Success.',
                        agent: data
                    }
                } else {
                    dataReturn    =   {
                        code: 400,
                        text: 'Login Failed.'
                    }
                }
                resolve(dataReturn);
            });
        });
        return loginPromise;
    }
}

const agents      =   new Agents();
module.exports  =   agents;