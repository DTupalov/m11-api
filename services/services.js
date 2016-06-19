'use strict';

const filter = require('./helpers/filter');
const paginator = require('./helpers/paginator');
const serviceList = require('./helpers/service_list');
const ParameterRequiredError = require('../utils/Error').ParameterRequiredError;

module.exports = function (session, period_id, date_from, date_to) {
    return new Promise(function (resolve, reject) {

        if (!session || !session.onm_group || !session.onm_session || !period_id || !date_from || !date_to) {
            reject(new ParameterRequiredError());
        }
        
        let result = {
            services : []
        };

        filter(session, '12.2015.' + period_id, '100100000000000004966', 'month_bills2', date_from, date_to)
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
                let uniqServices = {};
                let resultServices = services.filter((serviceData)=>{
                    let hash = serviceData.tariff+serviceData.service;
                    if (!uniqServices[hash]) {
                        uniqServices[hash] = serviceData.id;
                    }
                    return serviceData.quantity !== 0 && uniqServices[hash] === serviceData.id;
                });

                services = [];
                resultServices.forEach((serviceData)=>{
                    services.push(serviceData.id);
                });

                result.services = services;

                resolve(result);
            })
            .catch(function (e) {
                reject(e);
            })

    });
};