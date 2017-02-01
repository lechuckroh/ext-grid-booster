class Cache {
    constructor(name, cacheId, options, dataList) {
        const now = Date.now();

        this._name = name;
        this._cacheId = cacheId;
        this._options = options;
        this._dataList = dataList || [];
        this._sortOptions = [];
        this._lastAccessTime = now;
        this._createdAt = now;
        this._dataList = dataList;
    }

    get name() {
        return this._name;
    }

    get cacheId() {
        return this._cacheId;
    }

    get options() {
        return this._options;
    }

    get dataList() {
        return this._dataList;
    }

    set dataList(value) {
        this._dataList = value;
    }

    get sortOptions() {
        return this._sortOptions;
    }

    get lastAccessTime() {
        return this._lastAccessTime;
    }

    get createdAt() {
        return this._createdAt;
    }

    clear() {
        this._dataList = [];
    }

    getData(start, limit) {
        const total = this._dataList.length;
        const data = this._dataList.slice(start, start + limit);

        this._lastAccessTime = Date.now();

        return {total, data};
    }

    sort(options) {
        this._sortOptions = options;

        const comparators = options.map(option => {
            const property = option.property;
            const direction = (option.direction || 'asc').toLowerCase();
            const desc = direction === 'desc';

            return function (d1, d2) {
                const p1 = d1[property];
                const p2 = d2[property];
                const result = (p1 < p2) ? -1 : ((p1 > p2) ? 1 : 0);
                return desc ? -result : result;
            };
        });

        this._dataList.sort(function (d1, d2) {
            for (const comparator of comparators) {
                const result = comparator(d1, d2);
                if (result !== 0) {
                    return result;
                }
            }
            return 0;
        });
    }
}

module.exports = Cache;
