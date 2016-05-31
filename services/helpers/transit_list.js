'use strict';

const cheerio = require('cheerio');

module.exports = function (table) {
    let result = [];

    if (table) {
        let $ = cheerio.load(table);

        $('.simple').each(function (index, row) {
            let cells = $(row).find('td');
            let credit = Number($(cells.get(7)).text().replace(' ', ''));

            result.push({
                id      : $(row).attr('data-obj-id'),
                date    : $(cells.get(0)).text(),
                entrance: $(cells.get(2)).text(),
                exit    : $(cells.get(1)).text(),
                PAN     : $(cells.get(3)).text(),
                class   : $(cells.get(4)).text(),
                price   : credit
            });

        });
    }

    return result;
};