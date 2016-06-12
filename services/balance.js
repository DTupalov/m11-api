'use strict';

const request = require('request');
const cheerio = require('cheerio');

module.exports = function (session) {
    return new Promise(function (resolve, reject) {

        let uri = 'https://private.15-58m11.ru/onyma/system/literpc/';
        let result = {
            "balance"  : 0.00,
            "isSuccess": false
        };
        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, uri);
        cookieJAR.setCookie('onm_session=' + session.onm_session, uri);

        request({
            method: 'POST',
            uri   : uri,
            jar   : cookieJAR,
            form  : {
                body: JSON.stringify([{
                    "id"     : 0,
                    "package": "crms-balance-refresher",
                    "fn"     : "refresh",
                    "data"   : {}
                }])
            }

        }, (error, response, body) => {

            if (error) {
                result.isSuccess = false;
                resolve(result);
                return;
            }

            body = (JSON.parse(body)).result[0].result.result;
            let $ = cheerio.load(body);
            let balance = $($('.infoblock .value').get(2)).text();

            result.balance = Number(balance);
            result.isSuccess = true;
            resolve(result);
        });
    })
};