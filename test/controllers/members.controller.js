'use strict';

const models = require('../../src/models/index');
const ModelHelper = require('../../src/models/modelHelper');
const Helper = require('../../src/controllers/controllerHelper');
const replyOk = Helper.replyOk;
const replyError = Helper.replyError;

const createJsonpScript = function (callback, total, data) {
    const jsonStr = JSON.stringify({total, data});
    return `${callback}(${jsonStr});`;
};

/** Find all members */
exports.findAll = function (req, reply) {
    const query = req.query;
    const start = parseInt(query.start || '0');
    const limit = parseInt(query.limit || '100');
    const callback = query.callback || '';
    const sort = JSON.parse(query.sort || '[]');

    // Member
    models.Member
        .findAndCountAll({
            where: {},
            limit: limit,
            offset: start,
            order: sort.map(o => `${o.property} ${o.direction}`).join(',')
        })
        .then(result => {
            const script = createJsonpScript(callback,
                result.count,
                result.rows.map(row => row.dataValues));
            replyOk(reply, script);
        })
        .catch(err => replyError(reply, err));
};

/** Find all members using sqlite native query */
exports.findAllSqlite = function (req, reply) {
    const query = req.query;
    const start = parseInt(query.start || '0');
    const limit = parseInt(query.limit || '100');
    const callback = query.callback || '';
    const sort = JSON.parse(query.sort || '[]');

    ModelHelper
        .findAndCount(models.sequelize, {
            column: 'm.id as id, m.name, m.address, m.age, t.name as teamName',
            from: 'member m, team t',
            where: 'm.team_id = t.id',
            sort,
            start,
            limit
        })
        .then(result => {
            const total = result.total;
            const rows = result.rows;
            const script = createJsonpScript(callback, total, rows);
            replyOk(reply, script);
        })
        .catch(err => replyError(reply, err));
};
