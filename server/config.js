var os          =   require('os');

const config =   {
    mysqlConnection: {
        hostName: 'localhost',
        userName: 'root',
        password: os.hostname() == 'ubuntu' ? 'c9j98y5t' : '',
        dbName: 'nuntius'
    },
    hashSecret: 'UfsyFLgM',
    port: os.hostname() == 'ubuntu' ? 800 : 80
};


module.exports  =    config;