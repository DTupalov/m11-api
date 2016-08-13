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

        let result = [];

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

                $('.w-html-ro > table > tr').each((index, row) => {
                    if (index === 0) {
                        return;
                    }

                    let abonement = {
                        contract  : '',
                        pan       : '',
                        abonement : '',
                        start_date: '',
                        end_date  : '',
                        quantity  : '',
                        status    : false
                    };

                    $(row).find('td').each((index, cell) => {
                        switch (index) {
                            case 0: {
                                abonement.contract = $(cell).text();
                                break;
                            }
                            case 1: {
                                abonement.pan = $(cell).text();
                                break;
                            }
                            case 2: {
                                abonement.abonement = $(cell).text();
                                break;
                            }
                            case 3: {
                                abonement.start_date = $(cell).text();
                                break;
                            }
                            case 4: {
                                abonement.end_date = $(cell).text();
                                break;
                            }
                            case 5: {
                                abonement.quantity = $(cell).text();
                                break;
                            }
                            case 6: {
                                abonement.status = $(cell).text() === 'Активирован';
                                break;
                            }
                        }
                    });

                    result.push(abonement);
                });

                resolve(result);
            } catch (e) {
                reject(e);
            }

        });
    })
};