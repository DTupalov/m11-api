'use strict';

const express = require('express');
const contracts = express.Router();
const contractsService = require('../../services/contracts');

contracts.get('/', function (req, res, next) {

    let session = null;
    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
    } catch (e) {
    }

    if (!session) {
        next({status: 403});
    }

    contractsService(session)
        .then(function (contracts) {
            let result = [];

            if (contracts.isSuccess) {
                if (Array.isArray(contracts.contracts) && contracts.contracts.length > 0) {
                    result = contracts.contracts;
                    res.status(200);
                    res.json(result);
                } else {
                    next({status: 404});
                }
            } else {
                next({status: 403});
            }
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = contracts;