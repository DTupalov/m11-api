'use strict';

const request = require('request');
const isLoggedIn = require('./is_logged_in');

module.exports = function (session, amount, contract) {
    return new Promise(function (resolve, reject) {

        let result = {
            "pay_url"  : "",
            "isSuccess": false
        };
        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, 'https://private.15-58m11.ru/onyma/payments/sberbank');
        cookieJAR.setCookie('onm_session=' + session.onm_session, 'https://private.15-58m11.ru/onyma/payments/sberbank');

        request({
            method : 'POST',
            baseUrl: 'https://private.15-58m11.ru/',
            uri    : '/onyma/payments/sberbank/',
            jar    : cookieJAR,
            form   : {
                'contract'   : contract,
                'product_price': amount,
                'next'  : 'Далее'
            }
        }, (error, response, body) => {

            if (!isLoggedIn(response)) {
                result.isSuccess = false;
                resolve(result);
                return;
            }
            
            result.pay_url = response.headers.location;
            result.isSuccess = true;
            resolve(result);
        });
    })
};