'use strict';

const request = require('request');
const isLoggedIn = require('../is_logged_in');
const qs = require('querystring');

module.exports = function (session, parent, type, page) {
    return new Promise(function (resolve, reject) {

        let uri = 'https://private.15-58m11.ru/onyma/rm/party/bills_summary2/' + type;
        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, uri);
        cookieJAR.setCookie('onm_session=' + session.onm_session, uri);

        request({
            method: 'GET',
            uri   : uri + '?' + qs.stringify({
                __ilink_id__  : '3100100000000000000238',
                __parent_obj__: parent,
                page          : page,
                simple        : '1'
            }),
            jar   : cookieJAR
        }, (error, response, body) => {

            if (!isLoggedIn(response)) {
                reject({status: 403});
            }

            body = JSON.parse(body).simple;

            resolve(body);
        });
    })
};