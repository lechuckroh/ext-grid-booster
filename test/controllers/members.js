'use strict';

const root = '../..';
const models = require(`${root}/src/models/index`);
const Helper = require(`${root}/src/controllers/controller_helper`);

/** Find all members */
exports.select = function (req, reply) {
    Helper.select(req, reply, models.Member);
};

/** Find all members using sqlite native query */
exports.selectNative = function (req, reply) {
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

    Helper.selectNative(req, reply, selectBuilder, countBuilder);
};
