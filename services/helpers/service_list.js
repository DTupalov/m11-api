'use strict';

const cheerio = require('cheerio');

module.exports = function (table) {
    let result = [];

    if (table) {
        let $ = cheerio.load(table);
        $('.simple').each((index, el) => {
            result.push({
                id     : $(el).attr('data-obj-id'),
                tariff : $($(el).find('td').get(2)).text(),
                service: $($(el).find('td').get(3)).text(),
                quantity: parseInt($($(el).find('td').get(6)).text())
            });
        });
    }

    return result;
};