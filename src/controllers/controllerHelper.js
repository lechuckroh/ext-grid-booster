'use strict';

const Boom = require('boom');
const config = require('../config');
const sequelize = require('../models/index').sequelize;

const logResponse = function (res) {
    console.log('Response: ' + [
            `statusCode = ${res.statusCode}`,
            `payload = ${res.payload}`,
            `result = ${res.result}`
        ].join(', '));
};


const replyJson = function (reply, obj, statusCode) {
    if (statusCode) {
        // TODO: apply statusCode
        reply(JSON.stringify(obj));
    } else {
        reply(JSON.stringify(obj));
    }
};


const replyOk = function (reply, obj) {
    reply(obj);
};


const replyBadRequest = function (reply, message) {
    reply(Boom.badRequest(message));
};


const replyError = function (reply, err) {
    console.error(err.stack);
    reply(err);
};

const createJsonpScript = function (callback, total, data) {
    const jsonStr = JSON.stringify({total, data});
    return `${callback}(${jsonStr});`;
};


const findAll = function (req, reply, model, where = {}) {
    const query = req.query;
    const start = parseInt(query.start || '0');
    const limit = parseInt(query.limit || '100');
    const callback = query.callback || '';
    const sort = JSON.parse(query.sort || '[]');

    model.findAndCountAll({
        where,
        limit,
        offset: start,
        order: sort.map(o => `${o.property} ${o.direction}`).join(',')
    }).then(result => {
        const script = createJsonpScript(callback,
            result.count,
            result.rows.map(row => row.dataValues));
        replyOk(reply, script);
    }).catch(err => replyError(reply, err));
};


const createOrderByQuery = function(sortOptions) {
    if (!sortOptions) {
        return '';
    }

    const str = sortOptions
        .map(opt => `${opt.property} ${opt.direction || ''}`)
        .filter(s => !!s)
        .join(', ');
    return str ? `ORDER BY ${str}` : '';
};

const createLimitQuery = function(start, limit) {
    const dialect = config.dialect;
    switch ((dialect || '').toLowerCase()) {
        case 'mysql':
        case 'postgres':
        case 'sqlite':
            return `LIMIT ${limit} OFFSET ${start}`;
        case 'mssql':
            return `OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY`;
        default:
            console.error(`Unhandled dialect: ${dialect}`);
            return '';
    }
};

const findNative = function (req,
                             reply,
                             selectQueryBuilder,
                             countQueryBuilder) {
    const query = req.query;
    const start = parseInt(query.start || '0');
    const limit = parseInt(query.limit || '100');
    const callback = query.callback || '';
    const sort = JSON.parse(query.sort || '[]');

    const countQuery = countQueryBuilder();
    const selectQuery = selectQueryBuilder({
        start, limit, sort
    });

    let total = 0;
    sequelize
        .query(countQuery, {
            type: sequelize.QueryTypes.SELECT
        })
        .then(rows => {
            const firstRow = rows[0];
            const key = Object.keys(firstRow)[0];
            total = firstRow[key];
            return sequelize.query(selectQuery, {
                type: sequelize.QueryTypes.SELECT
            })
        })
        .then(rows => {
            const script = createJsonpScript(callback, total, rows);
            replyOk(reply, script);
        })
        .catch(err => replyError(reply, err));
};

const getQueryBuilders = function(parts) {
    const columnPart = parts.columns;
    const fromPart = parts.from;
    const wherePart = parts.where;

    const countQueryBuilder = function() {
        return [
            'SELECT count(*)',
            `FROM ${fromPart}`,
            wherePart ? `WHERE ${wherePart}` : ''
        ].join(' ');
    };
    const selectQueryBuilder = function(options) {
        const orderBy = createOrderByQuery(options.sort);
        const limit = createLimitQuery(options.start, options.limit);
        return [
            `SELECT ${columnPart}`,
            `FROM ${fromPart}`,
            wherePart ? `WHERE ${wherePart}` : '',
            orderBy,
            limit
        ].join(' ');
    };

    return {
        count: countQueryBuilder,
        select: selectQueryBuilder
    };
};


exports.logResponse = logResponse;
exports.replyJson = replyJson;
exports.replyOk = replyOk;
exports.replyBadRequest = replyBadRequest;
exports.replyError = replyError;
exports.createJsonpScript = createJsonpScript;
exports.createOrderByQuery = createOrderByQuery;
exports.createLimitQuery = createLimitQuery;
exports.findAll = findAll;
exports.findNative = findNative;
exports.getQueryBuilders = getQueryBuilders;
