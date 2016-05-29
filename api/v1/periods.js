'use strict';

const express = require('express');
const periods = express.Router();
const periodsService = require('../../services/periods');

periods.get('/', function (req, res, next) {

    let session = null;
    let contract_id = req.query.contract_id;
    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
    } catch (e) {
    }

    if (!session || !contract_id) {
        next({status: 403});
    }

    periodsService(session, contract_id)
        .then(function (response) {
            if (response.isSuccess) {
                res.status(200);
                res.json({period_id: response.period_id});
            } else {
                next({status: 403});
            }
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = periods;