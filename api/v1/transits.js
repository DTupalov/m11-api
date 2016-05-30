'use strict';

const express = require('express');
const moment = require('moment');
const transits = express.Router();
const transitsService = require('../../services/transits');

transits.get('/', function (req, res, next) {

    let session = null;
    let services = req.query.services || '';
    let date_from = req.query.date_from || moment().format('YYYY-MM-01 00:00:00');
    let date_to = req.query.date_to || moment().endOf('month').format('YYYY-MM-DD 23:59:59');

    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
        services = services.split(',');
        date_from = moment(date_from).format('YYYY-MM-DD HH:mm:ss');
        date_to = moment(date_to).format('YYYY-MM-DD HH:mm:ss');
    } catch (e) {
        next(e);
    }

    if (!session && !Array.isArray(services) && services.length < 1) {
        next({status: 403});
    }

    transitsService(session, services, date_from, date_to)
        .then(function (transits) {
            let result = [];

            if (transits.isSuccess) {

                result = transits.data;
                res.status(200);
                res.json(result);
            } else {
                next({status: 403});
            }
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = transits;