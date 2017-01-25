'use strict';

exports.logResponse = function (res) {
    console.log(`Response statusCode: ${res.statusCode}, payload: ${res.payload}`);
};

exports.getDateOnly = function (date) {
    return require('moment')(date).format('YYYY-MM-DD');
};

exports.toQueryStr = function (paramObj) {
    return Object.entries(paramObj)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
};