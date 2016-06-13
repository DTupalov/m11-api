'use strict';

const cheerio = require('cheerio');

module.exports = function (table) {
    let result = [];

    if (table) {
        let $ = cheerio.load(table);
        let columnMap = {};

        $('.header').find('th').each((index, row) => {
            columnMap[$(row).attr('col_name')] = index;
        });

        $('.simple').each(function (index, row) {
            let cells = $(row).find('td');
            let credit = Number($(cells.get(columnMap['amount_tax'])).text().replace(' ', ''));

            result.push({
                id      : $(row).attr('data-obj-id'),
                date    : $(cells.get(columnMap['mdate'])).text(),
                entrance: $(cells.get(columnMap['remark'])).text(),
                exit    : $(cells.get(columnMap['tdfid'])).text(),
                PAN     : $(cells.get(columnMap['fid'])).text(),
                class   : $(cells.get(columnMap['tdid'])).text(),
                price   : credit
            });

        });
    }

    return result;
};