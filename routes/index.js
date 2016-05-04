const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const https = require('https');

/* GET home page. */
/*
 router.get('/', function(req, res, next) {
 res.render('index', { title: 'Express' });
 });
 */

function firstReq(callback) {
    var postData = querystring.stringify({
        'login'   : '31.52.6813',
        'password': '3894',
        'submit'  : 'Вход'
    });

    var options = {
        "method"  : "POST",
        "hostname": "private.15-58m11.ru",
        "port"    : 443,
        "path"    : "/onyma/",
        headers   : {
            "cache-control": "no-cache",
            "postman-token": "60b3fc81-6fb2-e01b-6b85-09a72fe32c98",
            "content-type" : "application/x-www-form-urlencoded"
        }
    };

    var req = https.request(options, (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

        callback(res);
    });

    req.write(postData);
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

function secondReq(res) {
    var options = {
        "method"  : "POST",
        "hostname": "private.15-58m11.ru",
        "port"    : 443,
        "path"    : "/onyma/",
        "followAllRedirects" : true,
        headers   : {
            "cache-control": "no-cache",
            "postman-token": "60b3fc81-6fb2-e01b-6b85-09a72fe32c98",
            "content-type" : "application/x-www-form-urlencoded",
            "Cookie"       : res.headers['set-cookie'][0] + ';' + res.headers['set-cookie'][1]
        }
    };

    var req = https.request(options, (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

        thirdReq(req.getHeader('Cookie'));
    });

    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

function thirdReq(cookie){
    var options = {
        "method"  : "GET",
        "hostname": "private.15-58m11.ru",
        "port"    : 443,
        "path"    : "/onyma/system/search/locator/?id=3100520000000000006813",
        "followAllRedirects" : true,
        headers   : {
            "cache-control": "no-cache",
            "postman-token": "60b3fc81-6fb2-e01b-6b85-09a72fe32c98",
            "content-type" : "application/x-www-form-urlencoded",
            "Cookie"       : cookie
        }
    };

    var req = https.request(options, (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });

        fourthReq(cookie);
    });

    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

function fourthReq(cookie){
    var options = {
        "method"  : "GET",
        "hostname": "private.15-58m11.ru",
        "port"    : 443,
        "path"    : "/onyma/rm/party/AAAXS9AAKAAB0bvAAv",
        "followAllRedirects" : true,
        headers   : {
            "cache-control": "no-cache",
            "postman-token": "60b3fc81-6fb2-e01b-6b85-09a72fe32c98",
            "content-type" : "application/x-www-form-urlencoded",
            "Cookie"       : cookie
        }
    };

    var req = https.request(options, (res) => {
        console.log('statusCode: ', res.statusCode);
        console.log('headers: ', res.headers);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

firstReq(secondReq);

module.exports = router;
