'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const profile = express.Router();
const profileService = require('../../services/profile');

profile.get('/', function (req, res, next) {

    let session = req.apiSession;

    if (!session) {
        next(new ParameterRequiredError());
        return;
    }

    profileService(session)
        .then(function (data) {
            let result = {
                lastname    : '',
                middlename  : '',
                firstname   : '',
                phone_number: '',
                email       : '',
                status      : false,
                account     : ''
            };

            result.lastname = data.lastname;
            result.middlename = data.middlename;
            result.firstname = data.firstname;
            result.phone_number = data.phone_number;
            result.email = data.email;
            result.status = data.status;
            result.account = data.account;

            res.json(result);
        })
        .catch(function (e) {
            next(e);
        });

});

module.exports = profile;