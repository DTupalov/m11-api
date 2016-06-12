'use strict';

const request = require('request');
const url = require('url');
const qs = require('querystring');

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

            if (error) {
                result.isSuccess = false;
                resolve(result);
                return;
            }

            let urlObject = url.parse(response.headers.location);

            result.pay_url = response.headers.location;
            result.order_id = qs.parse(urlObject.query).mdOrder;
            result.isSuccess = true;
            resolve(result);
        });
    })
};