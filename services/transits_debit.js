'use strict';

const filter = require('./helpers/filter');
const paginator = require('./helpers/paginator');
const transitDebitList = require('./helpers/transits_debit_list');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function (session, period_id, date_from, date_to) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session || !period_id || !date_from || !date_to) {
            reject(new ParameterRequiredError());
            return;
        }

        filter(session, '12.2015.' + period_id, '100100000000000004965', 'mdb_bills2', date_from, date_to)
            .then(function (params) {
                let pages = Number(params.pages);
                let table = params.table;
                let parentId = params.parent_id;
                let arrayOfListPromises = [];

                if (table) {
                    arrayOfListPromises.push(transitDebitList(table));
                }

                if (pages > 1) {
                    for (let page = 2; page <= pages; page++) {
                        arrayOfListPromises.push(
                            paginator(session, parentId, 'mdb_bills2', page)
                                .then(function (table) {
                                    return transitDebitList(table);
                                }));
                    }
                }
                return Promise.all(arrayOfListPromises);
            })
            .then(function (transitsByPages) {
                let transits = [].concat.apply([], transitsByPages);
                resolve(transits);
            })
            .catch(function (e) {
                reject(e)
            });
    })
};