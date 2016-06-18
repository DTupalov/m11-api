'use strict';

const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;
const NotAuthorized = require('../utils/Error').NotAuthorized;
const request = require('request');

module.exports = function (session) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session) {
            reject(new ParameterRequiredError('No session parameters'));
        }
        
        let uri = 'https://private.15-58m11.ru/onyma/system/literpc/';

        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, uri);
        cookieJAR.setCookie('onm_session=' + session.onm_session, uri);

        request({
            method: 'POST',
            uri   : uri,
            jar   : cookieJAR,
            form  : {
                body: JSON.stringify([{
                    "id"     : 0,
                    "package": "crms-balance-refresher",
                    "fn"     : "refresh",
                    "data"   : {}
                }])
            }

        }, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                body = JSON.parse(body);
                if (!(body).auth_failed) {
                    resolve();
                } else {
                    reject(new NotAuthorized());
                }
            } catch (e) {
                reject(new NotAuthorized());
            }
        });
    })
};