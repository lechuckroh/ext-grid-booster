'use strict';

exports.camelCaseToSnakeCase = function (str) {
    return str.replace(/([A-Z])/g, function ($1) {
        return "_" + $1.toLowerCase();
    });
};

exports.encodeBase64 = function (str) {
    return new Buffer(str).toString('base64');
};

exports.decodeBase64 = function (str) {
    new Buffer(str, 'base64').toString('ascii');
};

exports.trim = function(str) {
    return String(str).replace(/^\s+|\s+$/g, '');
};

