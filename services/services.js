'use strict';

const filter = require('./helpers/filter');
const paginator = require('./helpers/paginator');
const serviceList = require('./helpers/service_list');

module.exports = function (session, period_id, date_from, date_to) {
    return new Promise(function (resolve, reject) {
        let result = {
            isSuccess: false,
            services : []
        };

        filter(session, '2015.12.' + period_id, '100100000000000004966', 'month_bills2', date_from, date_to)
            .then(function (params) {
                let pages = Number(params.pages);
                let table = params.table;
                let parentId = params.parent_id;
                let arrayOfListPromises = [];

                if (table) {
                    arrayOfListPromises.push(serviceList(table));
                }

                if (pages > 1) {
                    for (let page = 2; page <= pages; page++) {
                        arrayOfListPromises.push(
                            paginator(session, parentId, 'month_bills2', page)
                                .then(function (table) {
                                    return serviceList(table);
                                }));
                    }
                }

                return Promise.all(arrayOfListPromises);
            })
            .then(function (servicesByPages) {
                let services = [].concat.apply([], servicesByPages);

                result.isSuccess = true;
                result.services = services;

                resolve(result);
            })
            .catch(function () {
                result.isSuccess = false;
                resolve(result);
            })

    });
};