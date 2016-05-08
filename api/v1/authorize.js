'use strict';

const express = require('express');
const auth = express.Router();
const authService = require('../../services/auth');

auth.post('/', function (req, res, next) {

    let options = {
        login   : req.body.login,
        password: req.body.password
    };

    authService(options)
        .then(function (authorize) {

            let result = {};

            if (authorize.isSuccess) {
                res.status(200);
                result = {
                    session: new Buffer(JSON.stringify(authorize)).toString('base64')
                };
                res.json(result);
            } else {
                next({status: 403});
            }

        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = auth;