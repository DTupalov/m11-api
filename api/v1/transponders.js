'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const NotFoundError = require('../../utils/Error').NotFoundError;
const transponders = express.Router();
const transpondersService = require('../../services/transponders');
const transponderInfoService = require('../../services/transponder_info');

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

transponders.get('/item', function (req, res, next) {

    let session = req.apiSession;
    let contract_id = req.query.contract_id;
    let transponder_id = req.query.transponder_id;

    if (!session || !transponder_id || !contract_id) {
        next(new ParameterRequiredError());
        return;
    }

    transponderInfoService(session, transponder_id, contract_id)
        .then(function (info) {
            if (info) {
                res.json(info);
            } else {
                next(new NotFoundError());
            }
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = transponders;