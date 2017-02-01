'use strict';

const _ = require('lodash');
const os = require('os');
const Boom = require('boom');
const config = require('../config');
const sequelize = require('../models/index').sequelize;
const Cache = require('../cache/cache');
const cacheManager = require('../cache/cache_manager').instance();

const queryLogging = !!config['queryLogging'];

const logResponse = function (res) {
    console.log('Response: ' + [
            `statusCode = ${res.statusCode}`,
            `payload = ${res.payload}`,
            `result = ${res.result}`
        ].join(', '));
};

const fromJson = s => JSON.parse(s);
const toJson = obj => JSON.stringify(obj);

const replyJson = function (reply, obj, statusCode) {
    if (statusCode) {
        // TODO: apply statusCode
        reply(toJson(obj));
    } else {
        reply(toJson(obj));
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
    const jsonStr = toJson({total, data});
    return `${callback}(${jsonStr});`;
};

const toMB = value => (value / 1024 / 1024).toFixed(0);
const toGB = value => (value / 1024 / 1024 / 1024).toFixed(2);

const printMemory = function () {
    const usage = process.memoryUsage();
    const heapUsed = toMB(usage.heapUsed);
    const heapTotal = toMB(usage.heapTotal);
    const freeMem = toGB(os.freemem());
    const totalMem = toGB(os.totalmem());
    console.log(`Heap: ${heapUsed} / ${heapTotal} MB, Total: ${freeMem} / ${totalMem} GB`);
};

/**
 * Select data from database using ORM model.
 * The cacheId is returned after result data is stored in cache.
 */
const prepareCache = function (name, req, reply, model, where = {}) {
    const payload = req.payload;
    const refresh = payload.refresh === 'true';
    const options = where;

    // remove old caches
    cacheManager.removeOldCaches();

    // use matching cache if available
    if (!refresh) {
        const cache = cacheManager.findByNameAndOption(name, options);
        if (cache) {
            const cacheId = cache.cacheId;
            replyOk(reply, {cacheId});
            console.log(`Using old cache : ${cacheId}`);
            return;
        }
    }

    findAndCountAll(model, 0, 0, [], where)
        .then(result => {
            const cacheId = cacheManager.createCacheId();
            const data = result.data;
            const cache = new Cache(name, cacheId, options, data);
            cacheManager.add(cache);
            console.log(`New cache created : ${cacheId}`);

            replyOk(reply, {cacheId});
        })
        .catch(err => replyError(reply, err));

    printMemory();
};


/**
 * Select data from database using ORM model.
 */
const select = function (req, reply, model, where = {}) {
    const query = req.query;
    const start = parseInt(query.start || '0');
    const limit = parseInt(query.limit || '100');
    const callback = query.callback || '';
    const sort = fromJson(query.sort || '[]');
    const cacheId = query.cacheId;

    // Get data from cache
    if (cacheId) {
        const cache = cacheManager.findById(cacheId);
        if (cache) {
            // check sortOption change
            if (sort.length > 0 && !_.isEqual(sort, cache.sortOptions)) {
                cache.sort(sort);
            }

            const res = cache.getData(start, limit);
            const script = createJsonpScript(callback, res.total, res.data);
            replyOk(reply, script);
        } else {
            replyError(reply,
                new Error(`Cache not found. cacheId: ${cacheId}`));
        }
    }
    // Get data by SQL query
    else {
        findAndCountAll(model, start, limit, sort, where)
            .then(result => {
                const total = result.total;
                const data = result.data;
                const script = createJsonpScript(callback, total, data);
                replyOk(reply, script);
            })
            .catch(err => replyError(reply, err));
    }
};

const findAndCountAll = function (model, start, limit, sort, where = {}) {
    const option = {
        where,
        order: sort.map(o => `${o.property} ${o.direction}`).join(','),
        logging: queryLogging
    };
    if (limit > 0) {
        option.limit = limit;
        option.offset = start;
    }

    return model.findAndCountAll(option)
        .then(result => {
            return {
                total: result.count,
                data: result.rows.map(row => row.dataValues)
            };
        });
};


const createOrderByQuery = function (sortOptions) {
    if (!sortOptions) {
        return '';
    }

    const str = sortOptions
        .map(opt => `${opt.property} ${opt.direction || ''}`)
        .filter(s => !!s)
        .join(', ');
    return str ? `ORDER BY ${str}` : '';
};

const createLimitQuery = function (start, limit) {
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

const selectNative = function (req,
                               reply,
                               selectQueryBuilder,
                               countQueryBuilder) {
    const query = req.query;
    const start = parseInt(query.start || '0');
    const limit = parseInt(query.limit || '100');
    const callback = query.callback || '';
    const sort = fromJson(query.sort || '[]');

    const countQuery = countQueryBuilder();
    const selectQuery = selectQueryBuilder({
        start, limit, sort
    });

    let total = 0;
    sequelize
        .query(countQuery, {
            type: sequelize.QueryTypes.SELECT,
            logging: queryLogging
        })
        .then(rows => {
            const firstRow = rows[0];
            const key = Object.keys(firstRow)[0];
            total = firstRow[key];
            return sequelize.query(selectQuery, {
                type: sequelize.QueryTypes.SELECT,
                logging: queryLogging
            })
        })
        .then(rows => {
            const script = createJsonpScript(callback, total, rows);
            replyOk(reply, script);
        })
        .catch(err => replyError(reply, err));
};

const getQueryBuilders = function (parts) {
    const columnPart = parts.columns;
    const fromPart = parts.from;
    const wherePart = parts.where;

    const countQueryBuilder = function () {
        return [
            'SELECT count(*)',
            `FROM ${fromPart}`,
            wherePart ? `WHERE ${wherePart}` : ''
        ].join(' ');
    };
    const selectQueryBuilder = function (options) {
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
exports.prepareCache = prepareCache;
exports.select = select;
exports.selectNative = selectNative;
exports.getQueryBuilders = getQueryBuilders;
