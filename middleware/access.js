'use strict';

const isLoggedIn = require('../services/is_logged_in');

module.exports = function (req, res, next) {
    let session = req.query.session;

    if (!session) {
        next();
        return;
    }

    try {
        session = JSON.parse(new Buffer(req.query.session, 'base64').toString('ascii'));
    } catch (e) {
        next(e);
    }

    isLoggedIn(session)
        .then(() => {
            req.apiSession = session;
            next();
        })
        .catch((e) => {
            next(e);
        })
};