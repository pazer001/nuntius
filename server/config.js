var os          =   require('os');

const config =   {
    mysqlConnection: {
        hostName: 'localhost',
        userName: 'root',
        password: '',
        dbName: 'bus'
    },
    hashSecret: 'UfsyFLgM',
    URL: 'http://localhost',
    port: os.hostname() == 'DESKTOP-JFN538M' ? 80 : 800
};

module.exports  =    config;