'use strict';

const request = require('request');
const isLoggedIn = require('./is_logged_in');

module.exports = function (session) {
    return new Promise(function (resolve, reject) {

        let result = {
            "balance"  : 0.00,
            "isSuccess": false
        };
        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, 'https://private.15-58m11.ru/onyma/rm/party/' + session.dashboardURL);
        cookieJAR.setCookie('onm_session=' + session.onm_session, 'https://private.15-58m11.ru/onyma/rm/party/' + session.dashboardURL);

        request({
            method : 'GET',
            baseUrl: 'https://private.15-58m11.ru/',
            uri    : '/onyma/rm/party/' + session.dashboardURL,
            jar    : cookieJAR
        }, (error, response, body) => {

            if (!isLoggedIn(response)) {
                result.isSuccess = false;
                resolve(result);
                return;
            }

            let matched = body.match(/Баланс.+[\n\r\t\s]+?.+?>(.+?)</);
            let balance = Number((parseFloat(matched[1])).toFixed(2));
            result.balance = balance;
            result.isSuccess = true;
            resolve(result);
        });
    })
};