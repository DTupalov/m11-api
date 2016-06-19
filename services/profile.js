'use strict';

const request = require('request');
const cheerio = require('cheerio');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function (session) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session) {
            reject(new ParameterRequiredError('No session parameters'));
            return;
        }

        let result = {
            lastname    : '',
            middlename  : '',
            firstname   : '',
            phone_number: '',
            email       : '',
            status      : false,
            account     : ''
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

            if (error) {
                reject(error);
                return;
            }

            try {
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

                resolve(result);
            } catch (e) {
                reject(e);
            }

        });
    })
};