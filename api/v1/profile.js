'use strict';

const express = require('express');
const profile = express.Router();
const profileService = require('../../services/profile');

profile.get('/', function (req, res, next) {

    let session = null;
    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
    } catch (e) {
    }

    if (!session) {
        next({status: 403});
    }

    profileService(session)
        .then(function (profile) {
            let result = {
                lastname    : '',
                middlename  : '',
                firstname   : '',
                phone_number: '',
                email       : '',
                status      : false,
                account     : ''
            };

            if (profile.isSuccess) {
                result.lastname = profile.lastname;
                result.middlename = profile.middlename;
                result.firstname = profile.firstname;
                result.phone_number = profile.phone_number;
                result.email = profile.email;
                result.status = profile.status;
                result.account = profile.account;

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

module.exports = profile;