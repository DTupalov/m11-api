'use strict';

const querystring = require('querystring');
const https = require('https');
const data = {};

module.exports = function(options) {
    console.log(options);
    return new Promise(function (resolve, reject) {
        resolve({
            session: '1234',
            dashboardURL: 'AAAXS9AAKAAB0bvAAv',
            isSuccess: true
        });
    })
};