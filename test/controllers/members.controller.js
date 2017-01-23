'use strict';

const models = require('../../src/models/index');
const Helper = require('../../src/controllers/controllerHelper');

/** Find all members */
exports.findAll = function (req, reply) {
    Helper.findAll(req, reply, models.Member);
};

/** Find all members using sqlite native query */
exports.findAllNative = function (req, reply) {
    const countBuilder = function () {
        return `SELECT count(*)
         FROM member m, team t
         WHERE m.team_id = t.id`;
    };
    const selectBuilder = function (options) {
        const orderBy = Helper.createOrderByQuery(options.sort);
        const limit = Helper.createLimitQuery(options.start, options.limit);
        return [
            `SELECT m.id as id, m.name, m.address, m.age, t.name as teamName
            FROM member m, team t
            WHERE m.team_id = t.id`,
            orderBy,
            limit
        ].join(' ');
    };

    Helper.findNative(req, reply, selectBuilder, countBuilder);
};
