'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const periods = express.Router();
const periodsService = require('../../services/periods');

periods.get('/', function (req, res, next) {

    let session = req.apiSession;
    let contract_id = req.query.contract_id;

    if (!session || !contract_id) {
        next(new ParameterRequiredError());
        return;
    }

    periodsService(session, contract_id)
        .then(function (data) {
            res.json({period_id: data.period_id});
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = periods;