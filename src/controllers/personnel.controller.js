'use strict';

const models = require('../../src/models/index');
const Helper = require('../../src/controllers/controllerHelper');
const replyOk = Helper.replyOk;
const replyError = Helper.replyError;

const createJsonpScript = function (callback, total, data) {
    const jsonStr = JSON.stringify({total, data});
    return `${callback}(${jsonStr});`;
};

/** Find all */
exports.findAll = function (req, reply) {
    const query = req.query;
    const start = parseInt(query.start || '0');
    const limit = parseInt(query.limit || '100');
    const callback = query.callback || '';
    const sort = JSON.parse(query.sort || '[]');

    models.Personnel
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

    Personnel.sync({force: true}).then(() => {
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
            promises.push(Personnel.bulkCreate(list, {logging: false}));
        }

        console.log('Personnel populating...');
        Promise.all(promises).then(() => {
            console.log(`Personnel population finished.`);
        });
    });
};
