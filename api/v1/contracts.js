'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const NotFoundError = require('../../utils/Error').NotFoundError;
const contracts = express.Router();
const contractsService = require('../../services/contracts');

contracts.get('/', function (req, res, next) {

    let session = req.apiSession;

    if (!session) {
        next(new ParameterRequiredError());
        return;
    }

    contractsService(session)
        .then(function (data) {
            let result;

            if (Array.isArray(data.contracts) && data.contracts.length > 0) {
                result = data.contracts;
                res.json(result);
            } else {
                next(new NotFoundError());
            }
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = contracts;