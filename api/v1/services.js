'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const NotFoundError = require('../../utils/Error').NotFoundError;
const moment = require('moment');
const services = express.Router();
const servicesService = require('../../services/services');

services.get('/', function (req, res, next) {

    let session = req.apiSession;
    let period_id = req.query.period_id;
    let date_from = req.query.date_from || moment().format('YYYY-MM-01 00:00:00');
    let date_to = req.query.date_to || moment().endOf('month').format('YYYY-MM-DD 23:59:59');

    date_from = moment(date_from).format('YYYY-MM-01 HH:mm:ss');
    date_to = moment(date_to).format('YYYY-MM-DD 23:59:59');

    if (!session || !period_id) {
        next(new ParameterRequiredError());
        return;
    }

    servicesService(session, period_id, date_from, date_to)
        .then(function (data) {
            if (Array.isArray(data.services) && data.services.length > 0) {
                res.json({services: data.services});
            } else {
                next(new NotFoundError());
            }
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = services;