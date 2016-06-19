'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const NotFoundError = require('../../utils/Error').NotFoundError;
const moment = require('moment');
const transits = express.Router();
const transitsCreditService = require('../../services/transits_credit');
const transitsDebitService = require('../../services/transits_debit');

transits.get('/search', function (req, res, next) {

    let session = req.apiSession;
    let services = req.query.services || '';
    let date_from = req.query.date_from || moment().format('YYYY-MM-01 00:00:00');
    let date_to = req.query.date_to || moment().endOf('month').format('YYYY-MM-DD 23:59:59');

    if (!session || !services) {
        next(new ParameterRequiredError());
        return;
    }

    date_from = moment(date_from).format('YYYY-MM-DD HH:mm:ss');
    date_to = moment(date_to).format('YYYY-MM-DD HH:mm:ss');
    services = services.split(',');

    transitsCreditService(session, services, date_from, date_to)
        .then(function (data) {
            let result;

            if (Array.isArray(data) && data.length > 0) {
                result = data;
                res.json(result);
            } else {
                next(new NotFoundError());
            }

        })
        .catch(function (e) {
            next(e);
        });

});

transits.get('/debit', function (req, res, next) {

    let session = req.apiSession;
    let period_id = req.query.period_id || null;
    let date_from = req.query.date_from || moment().format('YYYY-MM-01 00:00:00');
    let date_to = req.query.date_to || moment().endOf('month').format('YYYY-MM-DD 23:59:59');

    if (!session || !services) {
        next(new ParameterRequiredError());
        return;
    }

    date_from = moment(date_from).format('YYYY-MM-DD HH:mm:ss');
    date_to = moment(date_to).format('YYYY-MM-DD HH:mm:ss');

    transitsDebitService(session, period_id, date_from, date_to)
        .then(function (data) {
            let result;

            if (Array.isArray(data) && data.length > 0) {
                result = data;
                res.json(result);
            } else {
                next(new NotFoundError());
            }

        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = transits;