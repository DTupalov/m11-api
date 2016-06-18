'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const balance = express.Router();
const balanceService = require('../../services/balance');
const paymentService = require('../../services/payment');

balance.get('/', function (req, res, next) {

    let session = req.apiSession;

    if (!session) {
        next(new ParameterRequiredError());
        return;
    }

    balanceService(session)
        .then(function (data) {
            let result = {
                balance: data.balance
            };

            res.json(result);
        })
        .catch(function (e) {
            next(e);
        });

});

balance.put('/', function (req, res, next) {

    let amount = Number(req.query.amount);
    let contract = req.query.contract;
    let session = req.apiSession;

    if (!session || !contract || !amount) {
        next(new ParameterRequiredError());
        return;
    } else if (amount < 100) {
        next(new RangeError('Amount is lower then 100'));
        return;
    }

    paymentService(session, amount, contract)
        .then(function (data) {
            let result = {
                pay_url : data.pay_url,
                order_id: data.order_id
            };

            res.json(result);
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = balance;