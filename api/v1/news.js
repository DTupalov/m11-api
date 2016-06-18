'use strict';

const express = require('express');
const ParameterRequiredError = require('../../utils/Error').ParameterRequiredError;
const news = express.Router();
const newsService = require('../../services/news');

news.get('/preview', function (req, res, next) {

    newsService.preview()
        .then(function (data) {
            let result = [];

            data.news.forEach(function (newsItem) {
                result.push(newsItem);
            });

            res.json(result);
        })
        .catch(function (e) {
            next(e);
        });

});

news.get('/details', function (req, res, next) {

    let link = req.query.link;

    if (!link) {
        next(new ParameterRequiredError());
        return;
    }

    newsService.details(link)
        .then(function (data) {
            res.json(data.newsItem);
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = news;