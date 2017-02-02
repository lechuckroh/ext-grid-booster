# 사용자 프로젝트 설정
[[English](customization.md)]

서버에서는 데모용 `Personnel` 모델을 정의해서 사용하고 있습니다.

이 모델을 사용하지 않는 경우 삭제하려면, [데모 모델 삭제](#remove) 섹션을 참고합니다.

## ORM을 사용하는 API
ORM 모델을 사용하려면, 먼저 모델을 정의해야 합니다.

### 모델 정의
모델들은 `src/models/` 디렉토리에 정의되어 있으며, 서버 구동시에 이 디렉토리에 있는 모델 파일들을 자동으로 스캔해서 사용하게 됩니다.

이 디렉토리에 있는 파일중에서 스캐닝에서 제외하려면 `src/models/index.js` 파일을 열어 다음 부분을 수정합니다:

```javascript
const excludes = [
    'model_helper.js'
];
scanDir(__dirname, excludes);
```

모델 정의는 `src/models/personnel.js` 파일을 참고합니다. 좀 더 자세한 내용은 [sequelize definition](http://docs.sequelizejs.com/en/v3/docs/models-definition) 문서를 참고합니다.

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

### 컨트롤러 정의
컨트롤러 파일들은 `src/controllers` 디렉토리에 정의되어 있습니다.

API를 정의하기 위해서는 컨트롤러 안에 함수를 정의한 다음, `controller_helper.js` 파일에 있는 `select(req, reply, model, where)` 메서드를 호출하기만 하면 됩니다. `where` 조건들을 추가하려면, [Sequelize Querying Where](http://docs.sequelizejs.com/en/v3/docs/querying/#where) 문서를 참고합니다.

```javascript
const Helper = require('../../src/controllers/controller_helper');
// ...
exports.selectORM = function (req, reply) {
    Helper.select(req, reply, models.Personnel);
};
```

### 라우트 추가
마지막으로 라우트를 추가해야 하는데, 라우트 설정은 `src/routes.js` 파일에 정의합니다.

아래와 같이 라우트를 등록합니다:

```javascript
const register = function (server) {
    routeGet(server, '/api/personnel', personnel.selectORM);
    // ...
};
```

## 네이티브 쿼리를 사용하는 API
네이티브 쿼리를 사용하려면 2개의 네이티브 쿼리가 필요합니다:
* 개수를 조회하는 쿼리 : `SELECT count(*) FROM personnel`
* 데이터를 조회하는 쿼리 : `SELECT id, name, email, phone FROM personnel`

정렬과 페이징 관련 파라미터들은 데이터 조회용 쿼리에만 적용됩니다. 대부분의 경우 두 쿼리의 `where` 조건절은 동일하며, 컬럼과 `order by`, 페이징만 달라집니다.

`controller_helper.js` 는 `selectNative(req, reply, selectQueryBuilder, countQueryBuilder)` 라는 함수를 제공하며, 인자로 사용되는 `selectQueryBuilder` 와 `countQueryBuilder` 함수는 다음과 같이 정의합니다:

```javascript
selectQueryBuilder = function (options) {
    // 데이터 조회 쿼리 반환
    const start = options.start;
    const limit = options.limit;
    const sort = options.sort;
    return 'SELECT * FROM foo where ... order by ... limit ...';
}

countQueryBuilder = function () {
    // 개수 조회 쿼리 반환
    return 'SELECT count(*) FROM foo where ...';
}
```

### order by
인자로 넘어온 `options.sort` 값은 배열 타입이며, 배열의 각 항목은 다음과 같은 속성들을 가집니다.
* `property` : 정렬할 컬럼명
* `direction` : 정렬 순서. `ASC` 또는 `DESC`

`src/controllers/controller_helper.js` 는 `order by` 절을 생성하기 위한 `createOrderByQuery(sort)`라는 헬퍼 함수를 제공합니다.

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

### 페이징
`src/controllers/controller_helper.js` 는 DB 타입에 맞는 페이징 쿼리를 생성하기 위한  `createLimitQuery(start, limit)` 함수를 제공합니다.

```javascript
// mysql, postgres, sqlite
Helper.createLimitQuery(10, 20) === 'LIMIT 20 OFFSET 10';
// mssql
Helper.createLimitQuery(10, 20) === 'OFFSET 10 ROWS FETCH NEXT 20 ROWS ONLY';
```

### queryBuilder 생성
`src/controllers/controller_helper.js` 는 단일 테이블 조회와 같은 단순한 쿼리를 위한 queryBuilder들을 생성해주는 `getQueryBuilders(obj)` 함수를 제공합니다.

```javascript
const builders = Helper.getQueryBuilders({
    columns: 'id, name, email, phone',
    from: 'personnel',
    where: "name = 'foo'"
});
const selectQueryBuilder = builders.select;
const countQueryBuilder = builders.count;
```

## 데모 모델 삭제<a name="remove"></a>
* `src/controllers/personnel.controller.js` 파일 삭제
* `src/models/personnel.js` 파일 삭제
* `src/index.js` 파일을 열어서 다음 라인을 찾아서 삭제합니다.
```javascript
// populate sample data
require('./controllers/personnel.controller').populateSampleData();
```
* `src/routes.js` 파일을 열어서 다음 라인을 찾아서 삭제합니다.
```javascript
const personnel = require('./controllers/personnel.controller');
```
* `src/routes.js` 파일을 열어서 `register` 함수안에 있는 항목들을 삭제합니다.
