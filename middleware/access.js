'use strict';

const isLoggedIn = require('../services/is_logged_in_middleware');

module.exports = function (req, res, next) {
    let session = req.query.session;
    if (session) {
        try {
            session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
        } catch (e) {
            next(e);
        }

        isLoggedIn(session)
            .then((result) => {
                if (result.isSuccess) {
                    next();
                } else {
                    next({status: 403});
                }
            })
            .catch((e) => {
                next(e);
            })
    } else {
        next();
    }
};