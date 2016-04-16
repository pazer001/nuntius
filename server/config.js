var os          =   require('os');

const config =   {
    mysqlConnection: {
        hostName: 'localhost',
        userName: 'root',
        password: '',
        dbName: 'bus'
    },
    hashSecret: 'UfsyFLgM',
    port: os.hostname() == 'ubuntu' ? 800 : 80,
    URL: `http://localhost:${800}`
};

module.exports  =    config;