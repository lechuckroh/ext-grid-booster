'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');
const expect = Code.expect;
const Cache = require('../../src/cache/cache');

lab.experiment("Cache", () => {

    lab.test("sort", done => {
        const dataList = [{
            id: 1,
            email: 'foo@example.com',
            phone: '444-555-2222',
            address: 'NewYork, US'
        }, {
            id: 2,
            email: 'aaa@example.com',
            phone: '999-111-2222',
            address: 'Seoul, Korea'
        }, {
            id: 3,
            email: 'bar@example.com',
            phone: '111-333-2222',
            address: 'NewYork, US'
        }];
        const cache = new Cache('', 1, {}, dataList);

        // sort
        const sortOptions = [{
            property: 'address',
            direction: 'desc'
        }, {
            property: 'email',
            direction: 'asc'
        }];
        cache.sort(sortOptions);

        const result1 = cache.getData(0, 3);
        expect(result1.total).to.equal(3);
        expect(result1.data.map(d => d.id)).to.equal([2, 3, 1]);

        const result2 = cache.getData(2, 2);
        expect(result2.total).to.equal(3);
        expect(result2.data.map(d => d.id)).to.equal([1]);

        done();
    });
});
