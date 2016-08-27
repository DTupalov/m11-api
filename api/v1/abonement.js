'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const NotFoundError = require('../../utils/Error').NotFoundError;
const abonements = express.Router();
const abonementsService = require('../../services/abonements');
const abonementsPurchaseService = require('../../services/abonements_purchase');

abonements.get('/', function (req, res, next) {

    let session = req.apiSession;

    if (!session) {
        next(new ParameterRequiredError());
        return;
    }

    abonementsService(session)
        .then(function (abonements) {
            let result;

            if (Array.isArray(abonements) && abonements.length > 0) {
                res.json(abonements);
            } else {
                next(new NotFoundError());
            }
        })
        .catch(function (e) {
            next(e);
        });

});

abonements.put('/purchase', function (req, res, next) {

    let session = req.apiSession;
    let data = {
        account_id : req.body.account_id,
        contract_id: req.body.contract_id,
        pan_id     : req.body.pan_id,
        fairPrice  : req.body.fairPrice,
        quantity   : req.body.quantity,
        direction  : req.body.direction,
        agreement  : req.body.agreement
    };

    if (!session || !data.account_id || !data.contract_id || !data.pan_id || !data.fairPrice || !data.quantity || !data.direction || !data.agreement) {
        next(new ParameterRequiredError());
        return;
    }

    abonementsPurchaseService(session, data)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = abonements;