'use strict';
var DB      =   require('../../DB');
var mysql   =   require('mysql');
var moment  =   require('moment');

class Action {
    postAction(sessionHash, actionName, extraData, userId) {
        return new Promise(function (resolve) {
            let query = `INSERT INTO nuntius.actions (actions.session_hash, actions.action_name, actions.extra_data, actions.user_id) VALUES(${sessionHash}, ${actionName}, ${extraData}, ${userId})`;
            DB.Q(query).then((data) => {
                if(DB.lastInsertedId()) {
                    let result  =   {
                        code: 200,
                        text: 'Action added successfully'
                    }
                } else {
                    let result  =   {
                        code: 400,
                        text: 'Action added failed'
                    }
                }
                resolve(result)
            })
        })
    }
}

const action      =   new Action();
module.exports  =   action;

