'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const NotFoundError = require('../../utils/Error').NotFoundError;
const transponders = express.Router();
const transpondersService = require('../../services/transponders');

transponders.get('/', function (req, res, next) {

    let session = req.apiSession;
    let contract_id = req.query.contract_id;

    if (!session || !contract_id) {
        next(new ParameterRequiredError());
        return;
    }

    transpondersService(session, contract_id)
        .then(function (transponders) {
            if (Array.isArray(transponders) && transponders.length > 0) {
                res.json(transponders);
            } else {
                next(new NotFoundError());
            }
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = transponders;