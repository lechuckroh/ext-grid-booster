'use strict';

const config = require('../config');
const models = require('../../src/models/index');
const Helper = require('../../src/controllers/controller_helper');

const logging = !!config['queryLogging'];

/** Prepare cache using ORM model */
exports.prepareCache = function (req, reply) {
    Helper.prepareCache('personnel', req, reply, models.Personnel);
};


/** Find all using ORM model */
exports.selectORM = function (req, reply) {
    Helper.select(req, reply, models.Personnel);
};


/** Find all using custom queryBuilders */
exports.selectNative1 = function (req, reply) {
    const countBuilder = function () {
        return `SELECT count(*) FROM personnel p`;
    };
    const selectBuilder = function (options) {
        const orderBy = Helper.createOrderByQuery(options.sort);
        const limit = Helper.createLimitQuery(options.start, options.limit);
        return [
            `SELECT id, name, email, phone FROM personnel`,
            orderBy,
            limit
        ].join(' ');
    };

    Helper.selectNative(req, reply, selectBuilder, countBuilder);
};

/** Find all using predefined queryBuilders */
exports.selectNative2 = function (req, reply) {
    const builders = Helper.getQueryBuilders({
        columns: 'id, name, email, phone',
        from: 'personnel',
        where: ''
    });

    Helper.selectNative(req, reply, builders.select, builders.count);
};


// Populate sample data
exports.populateSampleData = function () {
    const randomString = function (minLen, maxLen) {
        const len = randomInt(minLen, maxLen);
        let str = '';

        const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const dictLen = dict.length;
        for (let i = 0; i < len; i++) {
            str += dict.charAt(Math.floor(Math.random() * dictLen));
        }
        return str;
    };

    const randomInt = function (min, max) {
        const diff = max - min;
        return Math.floor(Math.random() * (diff + 1)) + min;
    };

    const sampleCount = 100000;
    const bulkSize = 100;
    const Personnel = models.Personnel;

    Personnel.sync({force: true, logging}).then(() => {
        console.log('Personnel synchronized.');

        const promises = [];
        for (let i = 1; i <= sampleCount / bulkSize; i++) {
            const list = [];
            for (let c = 0; c < bulkSize; c++) {
                const obj = {
                    name: randomString(2, 20),
                    email: `${randomString(2, 10)}@${randomString(2, 20)}.com`,
                    phone: randomInt(100, 999) + '-' + randomInt(1000, 9990)
                };
                list.push(obj);
            }
            promises.push(Personnel.bulkCreate(list, {logging}));
        }

        console.log('Personnel populating...');
        Promise.all(promises).then(() => {
            console.log(`Personnel population finished.`);
        });
    });
};
