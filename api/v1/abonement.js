'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const NotFoundError = require('../../utils/Error').NotFoundError;
const abonements = express.Router();
const abonementsService = require('../../services/abonements');

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

module.exports = abonements;