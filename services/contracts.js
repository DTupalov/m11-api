'use strict';

const request = require('request');
const cheerio = require('cheerio');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function (session) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session) {
            reject(new ParameterRequiredError('No session parameters'));
            return;
        }

        let result = {
            "contracts": []
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
                reject(result);
                return;
            }

            try {
                let $ = cheerio.load(body);
                $('#id_contract > option').each((index, el)=> {
                    result.contracts.push({
                        id    : $(el).val(),
                        number: $(el).html()
                    });
                });

                resolve(result);
            } catch (e) {
                reject(e);
            }
           
        });
    })
};