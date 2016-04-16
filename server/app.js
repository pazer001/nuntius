'use strict';
var appConfig   =   require('./config');
var tools       =   require('./tools');
var express     =   require('express');
var util        =   require('util');
var querystring =   require('querystring');
var bodyParser  =   require('body-parser')
var DB          =   require('./DB');
var mysql       =   require('mysql');
var crypto      =   require('crypto');
var compression =   require('compression');

var app         = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add headers
app.use('/admin', express.static('admin'));
app.use(compression({level: 9}));
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    next();
});

app.all('/chat/message/:sessionHash', function (req, res) {
    let sessionHash =   req.params.sessionHash,
        message     =   req.body.message || req.query.message,
        source      =   req.body.source || req.query.source;

    let controller  =   require('./controllers/chat/index');
    controller.postMessage(sessionHash, message, source).then(function(data) {
        res.json(data);
    });
});

app.get('/client/chatAndBannerLastMessages/:sessionId', (req, res) => {
    let sessionId       =   Number(req.params.sessionId),
        lastTimestamp   =   req.query.lastTimestamp,
        sessionHash     =   req.query.sessionHash,
        lastBannerView  =   req.query.lastBannerView;

    let controller      =   require('./controllers/client/index');
    controller.chatAndBannerLastMessages(sessionId, lastTimestamp, sessionHash, lastBannerView).then((data) => {
        res.jsonp(data);
    });
})

app.get('/data/newMessages/:sessionId', (req, res) => {
    let sessionId       =   Number(req.params.sessionId),
        lastTimestamp   =   req.query.lastTimestamp,
        sessionHash     =   req.query.sessionHash;

    let controller      =   require('./controllers/chat/index');
    controller.getMessage(sessionId, lastTimestamp, sessionHash).then((data) => {
        res.jsonp(data);
    });
});

app.get('/chat/getData/:companyId', function (req, res) {
    let companyId       =   Number(req.params.companyId),
        chatHashes      =   req.query.chatHashes,
        controller      =   require('./controllers/chat/index'),
        responseData    =   {};
    controller.getData(companyId, chatHashes).then((data) => {
        res.json(data)
    });
});

app.get('/chat/askForSession/:brand', function (req, res) {
    let requestIp   =   req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        brand       =   Number(req.params.brand),
        countryCode =   req.query.countryCode,
        userId      =   Number(req.query.userId),
        hash        =   crypto
                            .createHash('sha256')
                            .update(String(new Date().getTime()) + appConfig.hashSecret)
                            .digest('base64')
                            .replace(/\\/g, '')
                            .replace('/', '')
                            .replace('/', '')
                            .replace('/', '')
                            .replace('/', '')
                            .replace('+', '')
                            .replace('=', '');
    let controller  =   require('./controllers/chat/index');
    controller.askForSession(requestIp, brand, userId, hash, countryCode).then(function(data) {
        res.send(data);
    });
});

app.post('/chat/deleteSession/', function (req, res) {
    let requestIp   =   req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        sessionHash      =   req.body.sessionHash,
        controller  =   require('./controllers/chat/index');
    controller.deleteSession(requestIp, sessionHash).then(function(data) {
        res.send(data);
    });
});

app.post('/action/:sessionHash', function (req, res) {
    let sessionHash  =   req.params.sessionHash,
        actionName  =   req.body.actionName,
        extraData  =   req.body.extraData || '',
        userId      =   Number(req.body.userId);
    let controller  =   require('./controllers/chat/index');
    controller.postAction(sessionHash, actionName, extraData, userId).then(function(data) {
        res.send(data);
    });
});

app.post('/login/', function (req, res) {
    let email       =   req.body.email,
        password    =   req.body.password,
        companyId   =   req.body.companyId;
    let controller  =   require('./controllers/agents/index');
    controller.login(email, password, companyId).then((data) => {
        res.send(data);
    });
});

app.get('/banners/getBanners/:companyId', function (req, res) {
    let companyId   =   req.params.companyId,
        controller  =   require('./controllers/banners/index');
    controller.getBanners(companyId).then((data) => {
        res.send(data);
    });
});

app.post('/banners/sendBanner/', function (req, res) {
    let companyId   =   req.body.companyId,
        sessionHash =   req.body.sessionHash,
        bannerId    =   req.body.bannerId;
    let controller  =   require('./controllers/banners/index');
    controller.sendBanner(bannerId, sessionHash, companyId).then((data) => {
        res.send(data);
    })
        .catch((data) => {
            res.send(data);
        })
});

var listener    =   app.listen(80, function () {
    console.log('Nuntius app listening on port ' + listener.address().port + '!');
});