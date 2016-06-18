'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const auth = express.Router();
const authService = require('../../services/auth');

auth.post('/', function (req, res, next) {

    let login = req.body.login;
    let password = req.body.password;

    if (!login || !password) {
        next(new ParameterRequiredError('No login or password parameters'));
        return;
    }

    let options = {
        login   : login,
        password: password
    };

    authService(options)
        .then(function (data) {

            let result = {
                session: new Buffer(JSON.stringify(data)).toString('base64')
            };

            res.json(result);

        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = auth;