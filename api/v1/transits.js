'use strict';

const express = require('express');
const transits = express.Router();
// const transitsService = require('../../services/transits');

transits.get('/', function (req, res, next) {

    let session = null;
    let date_from = null;
    let date_to = null;
    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
        date_from = req.query.date_from;
        date_to = req.query.date_to;
    } catch (e) {
    }

    if (!session) {
        next({status: 403});
    }

    res.status(200);
    res.json([
        {
            "date"    : "2016-04-29T18:38:27",
            "entrance": "МОСКВА - ПВП1",
            "exit"    : "ЗЕЛЕНОГРАД - ПВП5",
            "PAN"     : "6058425000000085596",
            "class"   : "I класс(ММ)",
            "price"   : 120.00
        },
        {
            "date"    : "2016-04-29T18:38:27",
            "entrance": "МОСКВА - ПВП1",
            "exit"    : "ЗЕЛЕНОГРАД - ПВП5",
            "PAN"     : "6058425000000085596",
            "class"   : "I класс(ММ)",
            "price"   : 100.00
        },
        {
            "date"    : "2016-04-29T18:38:27",
            "entrance": "ЗЕЛЕНОГРАД - ПВП5",
            "exit"    : "МОСКВА - ПВП1",
            "pan"     : "6058425000000085596",
            "class"   : "I класс(ММ)",
            "price"   : 120.00
        },
    ]);

    /*transitsService(session, date_from, date_to)
     .then(function (transits) {
     let result = [];

     if (transits.isSuccess) {

     res.status(200);
     res.json(result);
     } else {
     next({status: 403});
     }
     })
     .catch(function (e) {
     next(e);
     });*/

});

module.exports = transits;