'use strict';

const request = require('request');

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
                reject(error);
            }

            try {
                body = JSON.parse(body);
                result.isSuccess = !(body).auth_failed;
            } catch (e) {
                result.isSuccess = false
            }

            resolve(result);
        });
    })
};