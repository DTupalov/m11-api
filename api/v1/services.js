'use strict';

const express = require('express');
const moment = require('moment');
const services = express.Router();
const servicesService = require('../../services/services');

services.get('/', function (req, res, next) {

    let session = null;
    let period_id = req.query.period_id;
    let date_from = req.query.date_from || moment().format('YYYY-MM-01 00:00:00');
    let date_to = req.query.date_to || moment().endOf('month').format('YYYY-MM-DD 23:59:59');
    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
        date_from = moment(date_from).format('YYYY-MM-01 HH:mm:ss');
        date_to = moment(date_to).format('YYYY-MM-DD 23:59:59');
    } catch (e) {
    }

    if (!session || !period_id) {
        next({status: 403});
    }

    servicesService(session, period_id, date_from, date_to)
        .then(function (response) {
            if (response.isSuccess) {
                res.status(200);
                res.json({services: response.services});
            } else {
                next({status: 403});
            }
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = services;