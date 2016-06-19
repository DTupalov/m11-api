'use strict';

const PromiseSeries = require('es6-promise-series');
const filter = require('./helpers/filter');
const paginator = require('./helpers/paginator');
const transitList = require('./helpers/transit_list');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function (session, services, date_from, date_to) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session || !Array.isArray(services) || !date_from || !date_to) {
            reject(new ParameterRequiredError());
            return;
        }

        let queue = [];

        services.forEach((serviceId)=> {
            queue.push(function () {
                return filter(session, serviceId, '3100100000000000000238', 'month_bills2/mdb_traf_d2', date_from, date_to)
                    .then(function (params) {
                        let pages = Number(params.pages);
                        let table = params.table;
                        let parentId = params.parent_id;
                        let arrayOfListPromises = [];

                        if (table) {
                            arrayOfListPromises.push(transitList(table));
                        }

                        if (pages > 1) {
                            for (let page = 2; page <= pages; page++) {
                                arrayOfListPromises.push(
                                    paginator(session, parentId, 'month_bills2/mdb_traf_d2', page)
                                        .then(function (table) {
                                            return transitList(table);
                                        }));
                            }
                        }
                        return Promise.all(arrayOfListPromises);
                    });
            });
        });

        PromiseSeries(queue)
            .then(function (transitsByPagesByServices) {
                let transits = [].concat.apply([], [].concat.apply([], transitsByPagesByServices));
                resolve(transits);
            })
            .catch(function (e) {
                reject(e)
            });
    })
};