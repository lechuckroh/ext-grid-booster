'use strict';

const config = require('../config');
const toSnake = require('../util/StringUtils').camelCaseToSnakeCase;

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

exports.deleteAll = function (models) {
    return Promise.all(models.map(model => model.destroy({where: {}})));
};

const querySelect = function (sequelize, sql) {
    return sequelize.query(sql, {
        type: sequelize.QueryTypes.SELECT
    });
};
exports.querySelect = querySelect;

const joinParts = function (array) {
    return array.filter(s => !!s).join(' ');
};

const createOrderByPart = function(sortOptions) {
    if (!sortOptions) {
        return '';
    }

    const str = sortOptions
        .map(opt => `${opt.property} ${opt.direction || ''}`)
        .filter(s => !!s)
        .join(', ');
    return str ? `ORDER BY ${str}` : '';
};

const createLimitPart = function(start, limit) {
    const dialect = config.dialect;
    switch ((dialect || '').toLowerCase()) {
        case 'mariadb':
        case 'mysql':
        case 'sqlite':
            return `LIMIT ${limit} OFFSET ${start}`;
        default:
            // TODO: check other dialects
            return `LIMIT ${limit} OFFSET ${start}`;
    }
};


exports.findAndCount = function (sequelize, options) {
    const columnPart = options.column;
    const fromPart = options.from;
    const wherePart = options.where;
    const sortOptions = options.sort;
    const start = options.start;
    const limit = options.limit;

    const selectSql = joinParts([
        `SELECT ${columnPart}`,
        `FROM ${fromPart}`,
        wherePart ? `WHERE ${wherePart}` : '',
        createOrderByPart(sortOptions),
        createLimitPart(start, limit)
    ]);

    const countSql = joinParts([
        `SELECT count(*) as count`,
        `FROM ${fromPart}`,
        wherePart ? `WHERE ${wherePart}` : ''
    ]);

    let total = 0;
    return querySelect(sequelize, countSql)
        .then(rows => {
            total = rows[0].count;
            return querySelect(sequelize, selectSql)
        })
        .then(rows => {
            return {
                total: total,
                rows: rows
            };
        });
};
