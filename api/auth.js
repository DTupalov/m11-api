'use strict';

const express = require('express');
const auth = express.Router();
const authService = require('../services/auth');

auth.post('/', function (req, res, next) {

    let options = {
        login: req.body.login,
        password: req.body.password
    };
    
    authService(options)
        .then(function(auth){
            
            let answer = {
                session: auth.session,
                dashboardURL: auth.dashboardURL,
                isSuccess: auth.isSuccess
            };
            
            res.json(answer);
        })
        .catch(function(e){
            next(e);
        });
});

module.exports = auth;