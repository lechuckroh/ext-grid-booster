'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');
const expect = Code.expect;
const Cache = require('../../src/cache/cache');
const CacheManager = require('../../src/cache/cacheManager');

lab.experiment("CacheManager", () => {

    lab.test("findById", done => {
        const cacheManager = new CacheManager();
        const cache1 = new Cache('', 1, {}, []);
        const cache2 = new Cache('', 2, {}, []);

        [cache1, cache2].forEach(cache => cacheManager.add(cache));

        expect(cacheManager.findById(1)).to.equal(cache1);
        expect(cacheManager.findById(2)).to.equal(cache2);
        expect(cacheManager.findById(3)).to.undefined();

        done();
    });

    lab.test("findByNameAndOption", done => {
        const cacheManager = new CacheManager();
        const cache1 = new Cache('foo', 1, {a: 1, b: 2}, []);
        const cache2 = new Cache('foo', 2, {a: 1}, []);
        const cache3 = new Cache('bar', 2, {a: 1}, []);

        [cache1, cache2, cache3].forEach(cache => cacheManager.add(cache));

        expect(cacheManager.findByNameAndOption('foo', {b: 2, a: 1}))
            .to.equal(cache1);
        expect(cacheManager.findByNameAndOption('foo', {a: 1}))
            .to.equal(cache2);
        expect(cacheManager.findByNameAndOption({})).to.undefined();

        done();
    });

    lab.test("removeById", done => {
        const cacheManager = new CacheManager();
        const cache1 = new Cache('', 1, {}, []);
        const cache2 = new Cache('', 2, {}, []);

        [cache1, cache2].forEach(cache => cacheManager.add(cache));

        expect(cacheManager.removeById(3)).to.equal(false);
        expect(cacheManager.removeById(1)).to.equal(true);
        expect(cacheManager.size()).to.equal(1);
        done();
    });

    lab.test("removeOldCaches", done => {
        const retentionMs = 1000 * 60;
        const cacheManager = new CacheManager(retentionMs);
        const cache1 = new Cache('', 1, {}, []);
        const cache2 = new Cache('', 2, {}, []);

        cache1._lastAccessTime = 0;

        [cache1, cache2].forEach(cache => cacheManager.add(cache));

        cacheManager.removeOldCaches();
        expect(cacheManager.size()).to.equal(1);
        expect(cacheManager.findById(1)).to.undefined();
        expect(cacheManager.findById(2)).to.equal(cache2);
        done();
    });
});
