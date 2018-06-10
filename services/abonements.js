'use strict';

const request = require('request');
const cheerio = require('cheerio');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function(session) {
  return new Promise(function(resolve, reject) {
    if (!session || !session.onm_group || !session.onm_session) {
      reject(new ParameterRequiredError('No session parameters'));
      return;
    }

    let result = [];

    let cookieJAR = request.jar();
    cookieJAR.setCookie(
      'onm_group=' + session.onm_group,
      'https://private.15-58m11.ru/onyma/rm/party/' + session.dashboardURL
    );
    cookieJAR.setCookie(
      'onm_session=' + session.onm_session,
      'https://private.15-58m11.ru/onyma/rm/party/' + session.dashboardURL
    );

    request(
      {
        method: 'GET',
        baseUrl: 'https://private.15-58m11.ru/',
        uri: '/onyma/rm/party/' + session.dashboardURL,
        jar: cookieJAR,
      },
      (error, response, body) => {
        if (error) {
          reject(error);
          return;
        }

        try {
          let $ = cheerio.load(body);

          let data = {
            contract: {
              name: 'Договор',
              columnIndex: null,
              value: '',
            },
            pan: {
              name: 'PAN',
              columnIndex: null,
              value: '',
            },
            abonement: {
              name: 'Абонемент',
              columnIndex: null,
              value: '',
            },
            start_date: {
              name: 'Дата начала',
              columnIndex: null,
              value: '',
            },
            end_date: {
              name: 'Дата окончания',
              columnIndex: null,
              value: '',
            },
            quantity: {
              name: 'Остаток поездок',
              columnIndex: null,
              value: '',
            },
            status: {
              name: 'Статус',
              columnIndex: null,
              value: false,
            },
          };

          $('.w-html-ro > table > tr').each((index, row) => {
            if (index === 0) {
              $(row)
                .find('th')
                .each((index, cell) => {
                  Object.keys(data).some(column => {
                    if (data[column].name === $(cell).text()) {
                      data[column].columnIndex = index;
                      return true;
                    }
                  });
                });
              return;
            }

            $(row)
              .find('td')
              .each((index, cell) => {
                Object.keys(data).some(column => {
                  if (data[column].columnIndex === index) {
                    data[column].value = $(cell).text();
                    return true;
                  }
                });
              });

            const abonement = Object.keys(data).reduce((acc, column) => {
              acc[column] = data[column].value;
              return acc;
            }, {});

            result.push(abonement);
          });

          resolve(result);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};
