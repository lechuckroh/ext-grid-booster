# Customization

The application has a sample model named `Personnel` for demonstration.

If you want to remove this model, see [Remove demo model](#remove) section.

## API using ORM
To use ORM model, you have to define model first.

### Define model
Models are stored in `src/models/` directory. Model files in this directory are scanned on startup.

If you want to exclude some files from scanning, edit `src/models/index.js`.

```javascript
const excludes = [
    'model_helper.js'
];
scanDir(__dirname, excludes);
```

Check `src/models/personnel.js` file to see how to define model file. See [sequelize definition](http://docs.sequelizejs.com/en/v3/docs/models-definition) documentation for details.

```javascript
'use strict';
const helper = require('./model_helper');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Personnel", {
        name: helper.STRING(DataTypes, 'name', 40, {allowNull: false}),
        email: helper.STRING(DataTypes, 'email', 60, {allowNull: true}),
        phone: helper.STRING(DataTypes, 'phone', 20, {allowNull: true})
    }, {
        tableName: 'personnel',
        timestamps: false,
        underscored: true,
        freezeTableName: true
    });
};
```

### Define controller
Controllers are stored in `src/controllers` directory.

Defining API is very simple. Just call `select(req, reply, model, where)` method in `controller_helper.js` and that's the end. To add `where` conditions, see [Sequelize Querying Where](http://docs.sequelizejs.com/en/v3/docs/querying/#where) documentation for details.

```javascript
const Helper = require('../../src/controllers/controller_helper');
// ...
exports.selectORM = function (req, reply) {
    Helper.select(req, reply, models.Personnel);
};
```

### Define route
The final step is route definition. Routes are defined in `src/routes.js` file.

Register routes like this:

```javascript
const register = function (server) {
    routeGet(server, '/api/personnel', personnel.selectORM);
    // ...
};
```

## API using native query
To use native query, two native queries are required :
* count selection query like `SELECT count(*) FROM personnel`
* data selection query like `SELECT id, name, email, phone FROM personnel`

Sorting and paging parameters are applied to data selection query only. In most cases, `where` conditions are the same. Columns, `order by` and paging are the different parts.

`controller_helper.js` provides `selectNative(req, reply, selectQueryBuilder, countQueryBuilder)` method for convinience. `selectQueryBuilder` and `countQueryBuilder` functions should be defined like :

```javascript
selectQueryBuilder = function (options) {
    // return data selection query
    const start = options.start;
    const limit = options.limit;
    const sort = options.sort;
    return 'SELECT * FROM foo where ... order by ... limit ...';
}

countQueryBuilder = function () {
    // return count selection query
    return 'SELECT count(*) FROM foo where ...';
}
```

### order by
`options.sort` value is array type.
* `property` : Sort column
* `direction` : Sort direction. `ASC` or `DESC`

`src/controllers/controller_helper.js` provides a helper method to create `order by` clause : `createOrderByQuery(sort)`.

```javascript
const sort = [{
    property: 'field1',
    direction: 'ASC'
}, {
    property: 'field2',
    direction: 'DESC'
}];
Helper.createOrderByQuery(sort) === 'ORDER BY field1 ASC, field2 DESC';
```

### paging
`src/controllers/controller_helper.js` provides a helper method to create dialect specific paging query : `createLimitQuery(start, limit)`.

```javascript
// mysql, postgres, sqlite
Helper.createLimitQuery(10, 20) === 'LIMIT 20 OFFSET 10';
// mssql
Helper.createLimitQuery(10, 20) === 'OFFSET 10 ROWS FETCH NEXT 20 ROWS ONLY';
```

### queryBuilder generation
`src/controllers/controller_helper.js` provides a helper method to create queryBuilders for simple query : `getQueryBuilders(obj)`.

```javascript
const builders = Helper.getQueryBuilders({
    columns: 'id, name, email, phone',
    from: 'personnel',
    where: "name = 'foo'"
});
const selectQueryBuilder = builders.select;
const countQueryBuilder = builders.count;
```

## Remove demo model<a name="remove"></a>
* delete `src/controllers/personnel.controller.js`
* delete `src/models/personnel.js`
* Open `src/index.js` and remove the following lines.
```javascript
// populate sample data
require('./controllers/personnel.controller').populateSampleData();
```
* Open `src/routes.js` and remove the following line.
```javascript
const personnel = require('./controllers/personnel.controller');
```
* Open `src/routes.js` and remove lines inside `register` function.
