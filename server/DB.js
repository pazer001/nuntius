'use strict';
var appConfig   =   require('./config');
var mysql       = require('mysql');
class DB {
    constructor() {
        this.instance   =   false;
        this.insertId   =   false;
    }

    Q(query) {
        var that    =   this
        let queryPromise    =   new Promise(function(resolve, reject) {
            that.insertId   =   false;
            var data    =   [];
            var connection = mysql.createConnection({
                host     : appConfig.mysqlConnection.hostName,
                user     : appConfig.mysqlConnection.userName,
                password : appConfig.mysqlConnection.password,
                charset  : 'utf8_general_ci'
            });
            connection.connect();
            connection.query(query, (err, rows, fields) => {
                connection.end();
                if (err || !rows) {
                    console.log(query);
                    reject({});
                    return;
                }

                let row = 0, length = rows.length;
                if(rows.insertId) that.insertId   =   rows.insertId;
                for(row; row < length; row++) {
                    data.push(rows[row]);
                }

                resolve(data)
            });
        });
        return queryPromise;
    }

    lastInsertedId() {
        return this.insertId
    }
}

const db    =   new DB();
module.exports  =   db;