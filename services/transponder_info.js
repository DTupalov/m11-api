'use strict';

const request = require('request');
const cheerio = require('cheerio');
const qs = require('querystring');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function (session, transponder_id, contract_id) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session || !contract_id || !transponder_id) {
            reject(new ParameterRequiredError('No session parameters'));
            return;
        }

        let result = null;
        let uri = 'https://private.15-58m11.ru/onyma/rm/party/contract_product/' + transponder_id;

        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, uri);
        cookieJAR.setCookie('onm_session=' + session.onm_session, uri);

        request({
            method: 'GET',
            uri   : uri + '?' + qs.stringify({
                '__ilink_id_': '100100000000000000616',
                '__parent_obj__': contract_id,
                '_contract_id': contract_id,
                'simple'      : '1'
            }),
            headers: {
                'Accept'          : 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            },
            jar   : cookieJAR
        }, (error, response, body) => {

            if (error) {
                reject(error);
                return;
            }

            try {
                let $ = cheerio.load(JSON.parse(body).simple);

                let classTS = $('span[data-column-name="a$3100420000000000000252"] > .w-text-ro').text();

                if (classTS) {
                    result = {
                        class: classTS
                    }
                }

                resolve(result);
            } catch (e) {
                reject(e);
            }

        });
    })
};