'use strict';

const express = require('express');
const request = require('request');
const https = require('https');

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
            if (error){
                reject(error);  
            }

            let PartyURLmatched = [];
            let cookies = [];
            let result = {};


            if (response.statusCode === 200 && /rm\/party\/.+$/g.test(response.request.uri.path)) {

                cookies = cookieJAR.getCookies(response.request.href);

                cookies.forEach((cookie) => {
                    result[cookie.key] = cookie.value;
                });

                PartyURLmatched = response.request.uri.path.match(/rm\/party\/(.+)$/g);
                result.dashboardURL = PartyURLmatched[0];
                result.isSuccess = true;

            } else {
                result.isSuccess = false;
            }

            resolve(result);
        });
    })
};