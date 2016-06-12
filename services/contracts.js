'use strict';

const request = require('request');
const cheerio = require('cheerio');

module.exports = function (session) {
    return new Promise(function (resolve, reject) {

        let result = {
            "contracts": [],
            "isSuccess": false
        };
        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, 'https://private.15-58m11.ru/onyma/payments/sberbank');
        cookieJAR.setCookie('onm_session=' + session.onm_session, 'https://private.15-58m11.ru/onyma/payments/sberbank');

        request({
            method : 'GET',
            baseUrl: 'https://private.15-58m11.ru/',
            uri    : '/onyma/payments/sberbank/',
            jar    : cookieJAR
        }, (error, response, body) => {

            if (error) {
                result.isSuccess = false;
                resolve(result);
                return;
            }

            let $ = cheerio.load(body);
            $('#id_contract > option').each((index, el)=> {
                result.contracts.push({
                    id    : $(el).val(),
                    number: $(el).html()
                });
            });

            result.isSuccess = true;
            resolve(result);
        });
    })
};