'use strict';

const request = require('request');
const cheerio = require('cheerio');
const qs = require('querystring');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function (session, contract_id) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session || !contract_id) {
            reject(new ParameterRequiredError());
            return;
        }

        let result = {
            period_id: ''
        };
        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, 'https://private.15-58m11.ru/onyma/rm/party/bills_summary2/');
        cookieJAR.setCookie('onm_session=' + session.onm_session, 'https://private.15-58m11.ru/onyma/rm/party/bills_summary2/');

        request({
            method : 'GET',
            baseUrl: 'https://private.15-58m11.ru/',
            uri    : '/onyma/rm/party/bills_summary2/?' + qs.stringify({
                _parent_id  : contract_id,
                __ilink_id__: '100100000000000004964',
                simple      : '1'
            }),
            jar    : cookieJAR
        }, (error, response, body) => {

            if (error) {
                reject(error);
                return;
            }

            try {
                body = (JSON.parse(body)).simple;

                let $ = cheerio.load(body);
                let firstElement = $('[data-obj-id]').get(0);
                let period = $(firstElement).attr('data-obj-id');
                let periodArray = period.split('.');

                result.period_id = periodArray[2];

                resolve(result);
            } catch (e) {
                reject(e);
            }

        });
    })
};