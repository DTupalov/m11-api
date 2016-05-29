'use strict';

const cheerio = require('cheerio');

module.exports = function (table) {
    let result = [];

    if (table) {
        let $ = cheerio.load(table);
        $('.simple').each((index, el) => {
            result.push($(el).attr('data-obj-id'));
        });
    }

    return result;
};