const _ = require('lodash');

let instance = null;

class CacheManager {

    constructor(retentionMs = 1000 * 60 * 30) {
        this._caches = {};
        this._retentionMs = retentionMs;
        this._lastCacheId = 0;
    }

    static instance() {
        if (!instance) {
            instance = new CacheManager();
        }
        return instance;
    }

    get retentionMs() {
        return this._retentionMs;
    }

    set retentionMs(value) {
        this._retentionMs = value;
    }

    size() {
        return Object.keys(this._caches).length;
    }

    clear() {
        this._caches = {};
    }

    add(cache) {
        if (cache) {
            const cacheId = cache.cacheId;
            const oldCache = this.findById(cacheId);
            if (!oldCache) {
                this._caches[cacheId] = cache;
                return true;
            }
        }
        return false;
    }

    findById(cacheId) {
        return this._caches[cacheId];
    }

    findByNameAndOption(name, option) {
        const caches = Object.values(this._caches)
            .filter(cache => {
                return cache.name === name && _.isEqual(cache.options, option);
            });

        const sorted = caches.sort(function(cache1, cache2) {
            const t1 = cache1.createdAt;
            const t2 = cache2.createdAt;
            return t1 < t2 ? 1 : (t1 > t2 ? -1 : 0);
        });

        // select recent created cache
        return sorted[0];
    }

    removeById(cacheId) {
        const cache = this.findById(cacheId);
        if (cache) {
            cache.clear();
            delete this._caches[cacheId];
            return true;
        }
        return false;
    }

    removeOldCaches() {
        const now = Date.now();
        Object.values(this._caches)
            .filter(cache => now - cache.lastAccessTime > this._retentionMs)
            .forEach(cache => this.removeById(cache.cacheId));
    }

    createCacheId() {
        this._lastCacheId = this._lastCacheId + 1;
        return this._lastCacheId;
    }
}

module.exports = CacheManager;
