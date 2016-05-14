'use strict';

const request = require('request');
const isLoggedIn = require('./is_logged_in');
const cheerio = require('cheerio');

module.exports = function (session) {
    return new Promise(function (resolve, reject) {

        let result = {
            lastname    : '',
            middlename  : '',
            firstname   : '',
            phone_number: '',
            email       : '',
            status      : false,
            account     : '',
            isSuccess   : false
        };
        let cookieJAR = request.jar();
        cookieJAR.setCookie('onm_group=' + session.onm_group, 'https://private.15-58m11.ru/onyma/rm/party/' + session.dashboardURL);
        cookieJAR.setCookie('onm_session=' + session.onm_session, 'https://private.15-58m11.ru/onyma/rm/party/' + session.dashboardURL);

        request({
            method : 'GET',
            baseUrl: 'https://private.15-58m11.ru/',
            uri    : '/onyma/rm/party/' + session.dashboardURL,
            jar    : cookieJAR
        }, (error, response, body) => {

            if (!isLoggedIn(response)) {
                result.isSuccess = false;
                resolve(result);
                return;
            }

            let $ = cheerio.load(body);
            $('.w-text-ro').each((index, el)=> {
                switch (index) {
                    case 0:
                    {
                        result.lastname = $(el).text();
                        break;
                    }
                    case 1:
                    {
                        result.firstname = $(el).text();
                        break;
                    }
                    case 2:
                    {
                        result.middlename = $(el).text();
                        break;
                    }
                    case 4:
                    {
                        result.phone_number = $(el).text().replace('Телефон: ', '');
                        break;
                    }
                    case 5:
                    {
                        result.email = $(el).text().replace('Email: ', '');
                        break;
                    }
                    case 6:
                    {
                        result.status = $(el).text() === 'Активный' ? true : false;
                        break;
                    }
                }
            });

            result.account = $('.infoblock .value').html();

            result.isSuccess = true;
            resolve(result);
        });
    })
};