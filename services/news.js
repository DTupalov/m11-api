'use strict';

const request = require('request');
const cheerio = require('cheerio');

module.exports = {

    preview: function (page) {
        return new Promise((resolve, reject) => {

            let uri = 'http://www.15-58m11.ru/news/';
            let result = {
                isSuccess: false,
                news     : []
            };

            request({
                method: 'GET',
                uri   : uri
            }, (error, response, body) => {

                if (error) {
                    result.isSuccess = false;
                    resolve(result);
                    return;
                }

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

                result.isSuccess = true;
                resolve(result);
            });
        });
    },

    details: function (link) {
        return new Promise((resolve, reject) => {

            let uri = 'http://www.15-58m11.ru' + link;
            let result = {
                isSuccess: false,
                newsItem : {}
            };

            request({
                method: 'GET',
                uri   : uri
            }, (error, response, body) => {

                if (error) {
                    result.isSuccess = false;
                    resolve(result);
                    return;
                }

                let $ = cheerio.load(body);
                let newsItem = $('.clr.left-side');

                result.newsItem = {
                    "date" : $(newsItem).find('.f-aqua.s12').text(),
                    "title": $(newsItem).find('h3').text(),
                    "text" : $(newsItem).find('.newsview').find('h3,p').remove() && $(newsItem).find('.newsview').text(),
                    "link" : link
                };

                result.isSuccess = true;
                resolve(result);
            });
        });
    }
};

