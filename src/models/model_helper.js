'use strict';

const _ = require('lodash');
const toSnake = require('../util/string').camelCaseToSnakeCase;

exports.STRING = function (DataTypes, fieldName, length, options) {
    const result = {
        field: toSnake(fieldName)
    };

    if (length && length > 0) {
        result.type = DataTypes.STRING(length);
    } else {
        result.type = DataTypes.STRING;
    }

    if (options) {
        Object.keys(options).forEach(key => {
            result[key] = options[key];
        });
    }

    return result;
};

exports.INTEGER = function (DataTypes, fieldName, options) {
    const result = {
        type: DataTypes.INTEGER,
        field: toSnake(fieldName)
    };

    if (options) {
        Object.keys(options).forEach(key => {
            result[key] = options[key];
        });
    }

    return result;
};

exports.BIGINT = function (DataTypes, fieldName, options) {
    const result = {
        type: DataTypes.BIGINT,
        field: toSnake(fieldName)
    };

    if (options) {
        Object.keys(options).forEach(key => {
            result[key] = options[key];
        });
    }

    return result;
};

exports.DATE = function (DataTypes, fieldName, options) {
    const result = {
        type: DataTypes.DATE,
        field: toSnake(fieldName)
    };

    if (options) {
        Object.keys(options).forEach(key => {
            result[key] = options[key];
        });
    }

    return result;
};

exports.DATEONLY = function (DataTypes, fieldName, options) {
    const result = {
        type: DataTypes.DATEONLY,
        field: toSnake(fieldName)
    };

    if (options) {
        Object.keys(options).forEach(key => {
            result[key] = options[key];
        });
    }

    return result;
};

exports.sync = function (models, option) {
    return Promise.all(models.map(model => model.sync(option)));
};

exports.deleteAll = function (models, options) {
    const opt = _.defaultsDeep({where: {}}, options);
    return Promise.all(models.map(model => model.destroy(opt)));
};
