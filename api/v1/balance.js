'use strict';

const express = require('express');
const balance = express.Router();
const balanceService = require('../../services/balance');
const paymentService = require('../../services/payment');

balance.get('/', function (req, res, next) {

    let session = null;
    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
    } catch (e) {
    }

    if (!session) {
        next({status: 403});
    }

    balanceService(session)
        .then(function (balance) {
            let result = {
                balance: 0.00
            };

            if (balance.isSuccess) {
                result.balance = balance.balance;
                res.status(200);
                res.json(result);
            } else {
                next({status: 403});
            }
        })
        .catch(function (e) {
            next(e);
        });

});

balance.put('/', function (req, res, next) {
    let session = null;
    let amount = Number(req.query.amount);
    let contract = req.query.contract;
    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
    } catch (e) {
    }

    if (!session || !contract || !amount || amount < 100) {
        next({status: 403});
    }

    paymentService(session, amount, contract)
        .then(function (payment) {
            let result = {
                pay_url : payment.pay_url,
                order_id: payment.order_id
            };

            res.json(result);
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = balance;