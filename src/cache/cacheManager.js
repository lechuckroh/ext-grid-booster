const _ = require('lodash');

class CacheManager {

    constructor(retentionMs = 1000 * 60 * 60) {
        this._caches = {};
        this._retentionMs = retentionMs;
    }

    size() {
        return Object.keys(this._caches).length;
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

    findByOption(option) {
        return Object.values(this._caches)
            .find(cache => _.isEqual(cache.options, option));
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
}

module.exports = CacheManager;
