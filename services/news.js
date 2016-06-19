'use strict';

const request = require('request');
const cheerio = require('cheerio');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = {

    preview: function () {
        return new Promise((resolve, reject) => {

            let uri = 'http://www.15-58m11.ru/news/';
            let result = {
                news: []
            };

            request({
                method: 'GET',
                uri   : uri
            }, (error, response, body) => {

                if (error) {
                    reject(error);
                    return;
                }

                try {
                    let $ = cheerio.load(body);
                    let news = $('.news-list > .item');

                    $(news).each(function (index, el) {
                        let item = {
                            "date" : $(el).find('.s12').text(),
                            "title": $(el).find('.s20').text(),
                            "text" : $(el).find('.text').text(),
                            "link" : $(el).find('a.f-aqua').attr('href')
                        };

                        result.news.push(item);
                    });

                    resolve(result);
                } catch (e) {
                    reject(e);
                }

            });
        });
    },

    details: function (link) {
        return new Promise((resolve, reject) => {

            if (!link) {
                reject(new ParameterRequiredError());
                return;
            }

            let uri = 'http://www.15-58m11.ru' + link;
            let result = {
                newsItem: {}
            };

            request({
                method: 'GET',
                uri   : uri
            }, (error, response, body) => {

                if (error) {
                    reject(error);
                    return;
                }

                try {
                    let $ = cheerio.load(body);
                    let newsItem = $('.clr.left-side');

                    result.newsItem = {
                        "date" : $(newsItem).find('.f-aqua.s12').text(),
                        "title": $(newsItem).find('h3').text(),
                        "text" : $(newsItem).find('.newsview').find('h3,p').remove() && $(newsItem).find('.newsview').text(),
                        "link" : link
                    };

                    resolve(result);
                } catch (e) {
                    reject(e);
                }

            });
        });
    }
};

