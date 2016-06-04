'use strict';

const express = require('express');
const news = express.Router();
const newsService = require('../../services/news');

news.get('/preview', function (req, res, next) {

    newsService.preview()
        .then(function (newsList) {
            let result = [];

            if (newsList.isSuccess) {
                newsList.news.forEach(function (newsItem) {
                    result.push(newsItem);
                });
                res.status(200);
                res.json(result);
            } else {
                next({status: 404});
            }
        })
        .catch(function (e) {
            next(e);
        });

});

news.get('/details', function (req, res, next) {

    let link = req.query.link;

    if (!link) {
        next({status: 400});
    }

    newsService.details(link)
        .then(function (newsItem) {
            if (newsItem.isSuccess) {
                res.status(200);
                res.json(newsItem.newsItem);
            } else {
                next({status: 404});
            }
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = news;