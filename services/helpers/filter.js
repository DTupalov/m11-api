/**
 * Created by D.Tupalov on 22.05.2016.
 */
'use strict';

const request = require('request');
const qs = require('querystring');
const cheerio = require('cheerio');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;

module.exports = function (session, parent_id, link_id, type, date_from, date_to) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session || !parent_id || !link_id || !type || !date_from || !date_to) {
            reject(new ParameterRequiredError());
        }

        let uri = 'https://private.15-58m11.ru/onyma/rm/party/bills_summary2/' + type + '/inline-filter/save/';
        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, uri);
        cookieJAR.setCookie('onm_session=' + session.onm_session, uri);

        request({
            method : 'POST',
            uri    : uri + '?' + qs.stringify({
                __ilink_id__  : link_id,
                __parent_obj__: parent_id
            }),
            jar    : cookieJAR,
            headers: {
                'Accept'          : 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            },
            form   : {
                raw_state: JSON.stringify([{
                    "f": "mdate",
                    "e": true,
                    "o": "between",
                    "v": [
                        {"fltfield": date_from},
                        {"fltfield": date_to}
                    ]
                }])
            }
        }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                let answer = JSON.parse(body);

                if (answer.errors && answer.errors.length > 0) {
                    reject(new Error(answer.errors));
                    return;
                }

                let paginator = JSON.parse(body).paginator;
                let table = JSON.parse(body).table;
                let $ = cheerio.load(paginator);
                let pages = $('.paginator').attr('data-total-pages');

                resolve({pages, table, parent_id});
            } catch (e) {
                reject(e)
            }

        });
    })
};