'use strict';

const request = require('request');
const NotAuthorized = require('../utils/Error').NotAuthorized;
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;
const isLoggedIn = function (response) {
    if (response && typeof response === 'object' && response.hasOwnProperty('body')) {
        return !(/Забыли пароль\?/g.test(response.body));
    } else {
        return false;
    }
};

module.exports = function (options) {

    return new Promise(function (resolve, reject) {

        let login = options.login;
        let password = options.password;
        let captcha_id = options.captcha_id;
        let captcha_text = options.captcha_text;

        if (!login || !password) {
            reject(new ParameterRequiredError('No login or password parameters'));
            return;
        }

        let cookieJAR = request.jar();

        request({
            method            : 'POST',
            baseUrl           : 'https://private.15-58m11.ru/',
            uri               : '/onyma/',
            followAllRedirects: true,
            jar               : cookieJAR,
            form              : {
                'login'    : login,
                'password' : password,
                'captcha_0': captcha_id,
                'captcha_1': captcha_text,
                'submit'   : 'Вход'
            }
        }, (error, response, body) => {
            let PartyURLmatched,
                cookies,
                result = {};

            if (error) {
                reject(error);
                return;
            } else if (response.statusCode !== 200 || !isLoggedIn(response)) {
                reject(new NotAuthorized());
                return;
            }

            try {
                cookies = cookieJAR.getCookies(response.request.href);

                cookies.forEach((cookie) => {
                    result[cookie.key] = cookie.value;
                });

                PartyURLmatched = response.request.uri.path.match(/rm\/party\/(.+)$/);
                result.dashboardURL = PartyURLmatched[1];

                resolve(result);
            } catch (e) {
                reject(e);
            }

        });
    })
};