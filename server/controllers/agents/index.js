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

    addAgent(companyId, agentName, agentRealName, agentEmail, agentPassword, agentLevel, deskName) {
        return new Promise((resolve) => {
            let addAgentQuery   =   `INSERT INTO nuntius.agents(company_id, desk, name, real_name, password, email, level_id)
                                    VALUES(
                                        '${companyId}',
                                        '${deskName}',
                                        '${agentName}',
                                        '${agentRealName}',
                                        '${agentPassword}',
                                        '${agentEmail}',
                                        '${agentLevel}'
                                    )`,
                resultData      =   {};
            DB.Q(addAgentQuery).then((data) => {
                if(DB.lastInsertedId()) {
                    resultData  =   {
                        code: 200
                    }
                } else {
                    resultData  =   {
                        code: 400
                    }
                }
                resolve(resultData)
            })
        })
    }
}

const agents      =   new Agents();
module.exports  =   agents;