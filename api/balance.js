const express = require('express');
const auth = express.Router();

auth.post('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;