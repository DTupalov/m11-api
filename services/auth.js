'use strict';

const request = require('request');
const isLoggedIn = require('./is_logged_in');

module.exports = function (options) {

    return new Promise(function (resolve, reject) {

        let cookieJAR = request.jar();

        request({
            method            : 'POST',
            baseUrl           : 'https://private.15-58m11.ru/',
            uri               : '/onyma/',
            followAllRedirects: true,
            jar               : cookieJAR,
            form              : {
                'login'   : options.login,
                'password': options.password,
                'submit'  : 'Вход'
            }
        }, (error, response, body) => {
            let PartyURLmatched = [];
            let cookies = [];
            let result = {
                isSuccess: false
            };

            if (error) {
                resolve(result);
                return;
            }

            if (response.statusCode === 200 && isLoggedIn(response)) {

                cookies = cookieJAR.getCookies(response.request.href);

                cookies.forEach((cookie) => {
                    result[cookie.key] = cookie.value;
                });

                PartyURLmatched = response.request.uri.path.match(/rm\/party\/(.+)$/);
                result.dashboardURL = PartyURLmatched[1];
                result.isSuccess = true;

            }

            resolve(result);
        });
    })
};