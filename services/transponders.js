'use strict';

const request = require('request');
const cheerio = require('cheerio');
const qs = require('querystring');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function (session, contract_id) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session || !contract_id) {
            reject(new ParameterRequiredError('No session parameters'));
            return;
        }

        let result = [];
        let uri = 'https://private.15-58m11.ru/onyma/rm/party/contract_product/';

        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, uri);
        cookieJAR.setCookie('onm_session=' + session.onm_session, uri);

        request({
            method: 'GET',
            uri   : uri + '?' + qs.stringify({
                '_contract_id': contract_id,
                '__ilink_id__': '100100000000000000616',
                'simple'      : '1'
            }),
            jar   : cookieJAR
        }, (error, response, body) => {

            if (error) {
                reject(error);
                return;
            }

            try {
                let $ = cheerio.load(JSON.parse(body).simple);

                $('tr.simple').each(function (index, el) {
                    result.push({
                        contract: $($(el).find('td').get(0)).text().replace(' ...',''),
                        pan: $($(el).find('td').get(1)).text(),
                        plan: $($(el).find('td').get(2)).text(),
                        status: $($(el).find('td').get(3)).text() === 'Активный'
                    });
                });

                resolve(result);
            } catch (e) {
                reject(e);
            }

        });
    })
};